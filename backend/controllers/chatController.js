const {
  Conversation,
  ConversationParticipant,
  Message,
  MessageReadStatus,
  User,
  OrderConversation,
  Sale,
  Vehicle,
  Customer
} = require('../models');
const { Op, where, fn, col } = require('sequelize');
const sequelize = require('../config/database');

// Create or get a conversation between two users
const createConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;

    // Validate roles and permissions
    const sender = await User.findByPk(senderId);
    const recipient = await User.findByPk(recipientId);

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Role-based access control
    if (sender.role === 'admin') {
      // Admin can chat with anyone
    } else if (sender.role === 'user') {
      // User can chat with admin or buyers
      if (recipient.role === 'user') {
        return res.status(403).json({
          success: false,
          message: 'Users cannot chat with other users'
        });
      }
    } else if (sender.role === 'buyer') {
      // Buyer can chat with users who contacted them and admin
      if (recipient.role === 'buyer') {
        return res.status(403).json({
          success: false,
          message: 'Buyers cannot chat with other buyers'
        });
      }
    }

    // Check if conversation already exists between these two users
    const existingConversations = await Conversation.findAll({
      include: [
        {
          model: ConversationParticipant,
          as: 'participants',
          attributes: ['user_id'],
          where: {
            user_id: { [Op.in]: [senderId, recipientId] }
          }
        }
      ]
    });

    // Find conversation that has both users as participants
    let existingConversation = null;
    for (const conv of existingConversations) {
      const participantIds = conv.participants.map(p => p.user_id);
      if (participantIds.includes(senderId) && participantIds.includes(recipientId)) {
        existingConversation = conv;
        break;
      }
    }

    if (existingConversation) {
      return res.json({
        success: true,
        message: 'Conversation already exists',
        data: existingConversation
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      type: 'private',
      created_by: senderId
    });

    // Add participants to conversation
    await ConversationParticipant.bulkCreate([
      {
        conversation_id: conversation.id,
        user_id: senderId,
        role: 'sender'
      },
      {
        conversation_id: conversation.id,
        user_id: recipientId,
        role: 'recipient'
      }
    ]);

    res.json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

// Get user's conversations
const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status = 'active' } = req.query;

    const offset = (page - 1) * limit;

    // Get conversations where user is a participant
    // For admins, get all conversations (especially order-related ones)
    let queryOptions = {
      include: [
        {
          model: ConversationParticipant,
          as: 'participants',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'full_name', 'email', 'role']
            }
          ]
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'full_name', 'role']
            }
          ]
        }
      ],
      where: {
        status
      },
      order: [
        [{ model: Message, as: 'messages' }, 'created_at', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    // For admins, we might want to include all conversations or at least order-related ones
    if (req.user.role === 'admin') {
      // Admins can see all conversations, but we'll still apply status filter
      // The query remains the same but the admin can access any conversation
    } else {
      // For regular users, only get conversations they participate in
      queryOptions.include[0].where = {
        user_id: userId
      };
    }

    const { count, rows: conversations } = await Conversation.findAndCountAll(queryOptions);

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.count({
          where: {
            conversation_id: conversation.id,
            sender_id: { [Op.ne]: userId }
          },
          include: [
            {
              model: MessageReadStatus,
              as: 'readStatuses',
              where: {
                user_id: userId,
                read_at: null
              },
              required: false
            }
          ]
        });

        return {
          ...conversation.toJSON(),
          unread_count: unreadCount
        };
      })
    );

    res.json({
      success: true,
      data: conversationsWithUnread,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get conversation messages
const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    // Check if user is participant in conversation
    const participant = await ConversationParticipant.findOne({
      where: {
        conversation_id: conversationId,
        user_id: userId
      }
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    // For admin users, allow access to all conversations
    // For regular users, only allow access to conversations they're part of
    let conversation;
    if (req.user.role === 'admin') {
      conversation = await Conversation.findByPk(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }
    } else {
      conversation = await Conversation.findOne({
        where: { id: conversationId },
        include: [
          {
            model: ConversationParticipant,
            as: 'participants',
            where: { user_id: userId }
          }
        ]
      });
    }

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const { count, rows: messages } = await Message.findAndCountAll({
      where: {
        conversation_id: conversationId
      },
      attributes: {
        include: ['created_at', 'updated_at']  // Explicitly include timestamp fields
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'full_name', 'role']
        },
        {
          model: MessageReadStatus,
          as: 'readStatuses',
          attributes: ['user_id', 'read_at'],
          required: false
        }
      ],
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Mark messages as delivered for this user
    await Message.update(
      { status: 'delivered' },
      {
        where: {
          conversation_id: conversationId,
          sender_id: { [Op.ne]: userId },
          status: { [Op.in]: ['sent', 'delivered'] }  // Only update sent/delivered messages, not read
        }
      }
    );

    res.json({
      success: true,
      data: messages,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Send a message
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    // Validate conversation exists and user is participant
    const participant = await ConversationParticipant.findOne({
      where: {
        conversation_id: conversationId,
        user_id: userId
      }
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message in this conversation'
      });
    }

    // Additional role-based validation for conversation participants
    const conversation = await Conversation.findByPk(conversationId, {
      include: [
        {
          model: ConversationParticipant,
          as: 'participants',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'role']
            }
          ]
        }
      ]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Role-based access control
    if (req.user.role === 'admin') {
      // Admin can chat in any conversation they are part of
      // Since we already verified the admin is a participant (line 329-341),
      // we don't need additional checks for admins
    } else if (req.user.role === 'user') {
      // User can chat with admin or buyers
      const userParticipants = conversation.participants.filter(p => p.user_id === userId);
      if (userParticipants.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User not authorized to send message in this conversation'
        });
      }

      // Check if conversation is with another user
      const otherParticipants = conversation.participants.filter(p => p.user_id !== userId);
      const hasUnauthorizedUser = otherParticipants.some(p => p.user.role === 'user');
      if (hasUnauthorizedUser) {
        return res.status(403).json({
          success: false,
          message: 'Users cannot chat with other users'
        });
      }
    } else if (req.user.role === 'buyer') {
      // Buyer can chat with users who contacted them and admin
      const buyerParticipants = conversation.participants.filter(p => p.user_id === userId);
      if (buyerParticipants.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Buyer not authorized to send message in this conversation'
        });
      }

      // Check if conversation is with another buyer
      const otherParticipants = conversation.participants.filter(p => p.user_id !== userId);
      const hasOtherBuyer = otherParticipants.some(p => p.user.role === 'buyer');
      if (hasOtherBuyer) {
        return res.status(403).json({
          success: false,
          message: 'Buyers cannot chat with other buyers'
        });
      }
    }

    // Handle file uploads if present
    let fileUrl = null;
    let fileName = null;

    if (req.files && req.files.length > 0) {
      // Import cloudinary if not already available
      const cloudinary = require('../config/cloudinary');
      const fs = require('fs');

      // Process the first file (for now, we'll just use the first file for single file storage)
      // In a more advanced implementation, you could store multiple files
      const file = req.files[0];
      fileName = file.originalname;

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'chat_attachments',
          use_filename: false,
          unique_filename: true,
          resource_type: 'auto' // Automatically detect if it's an image, video, or raw file
        });

        fileUrl = result.secure_url;

        // Remove the temporary file after upload
        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Remove the temporary file even if upload fails
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file to cloud storage'
        });
      }
    }

    // Set message type based on content and file presence
    let finalMessageType = messageType;
    if (!finalMessageType) {
      if (fileUrl) {
        // Determine message type based on file extension
        const fileExt = fileName ? fileName.split('.').pop()?.toLowerCase() : '';
        if (fileExt && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
          finalMessageType = 'image';
        } else if (fileExt && ['mp4', 'mov', 'avi', 'mkv'].includes(fileExt)) {
          finalMessageType = 'video';
        } else {
          finalMessageType = 'file';
        }
      } else {
        finalMessageType = 'text';
      }
    }

    // Create message
    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: userId,
      content: content || '', // Use empty string if no content provided
      message_type: finalMessageType,
      file_url: fileUrl,
      file_name: fileName
    });

    // Get full message with sender info
    const fullMessage = await Message.findByPk(message.id, {
      attributes: {
        include: ['created_at', 'updated_at']  // Explicitly include timestamp fields
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'full_name', 'role']
        }
      ]
    });

    // Emit the new message to the conversation room via socket
    // We need to access the io instance to emit the event
    if (global.io) {
      global.io.to(`conversation_${conversationId}`).emit('new_message', fullMessage);

      // Check if this is an order conversation and emit order update
      const { OrderConversation } = require('../models');
      const orderConversation = await OrderConversation.findOne({
        where: { conversation_id: conversationId },
        include: [
          {
            model: require('../models').Sale,
            as: 'sale',
            include: [
              {
                model: require('../models').Vehicle,
                as: 'vehicle'
              },
              {
                model: require('../models').Customer,
                as: 'customer'
              }
            ]
          }
        ]
      });

      if (orderConversation) {
        // Emit order message update to all participants in the conversation
        const { ConversationParticipant } = require('../models');
        const participants = await ConversationParticipant.findAll({
          where: { conversation_id: conversationId }
        });

        for (const participant of participants) {
          global.io.to(`user_${participant.user_id}`).emit('order_message_update', {
            orderId: orderConversation.sale_id,
            conversationId,
            message: fullMessage,
            orderDetails: orderConversation.sale
          });
        }

        // Additionally, emit to admin role room so all admins can see updates
        global.io.to(`role_admin`).emit('order_message_update', {
          orderId: orderConversation.sale_id,
          conversationId,
          message: fullMessage,
          orderDetails: orderConversation.sale
        });
      }
    }

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: fullMessage
    });
  } catch (error) {
    // Clean up any uploaded files in case of error
    if (req.files) {
      const fs = require('fs');
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(error);
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Check if user is participant in conversation
    const participant = await ConversationParticipant.findOne({
      where: {
        conversation_id: conversationId,
        user_id: userId
      }
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    // Get unread messages for this user in this conversation
    const unreadMessages = await Message.findAll({
      where: {
        conversation_id: conversationId,
        sender_id: { [Op.ne]: userId },
        status: { [Op.ne]: 'read' }  // Only update messages that aren't already read
      },
      include: [
        {
          model: MessageReadStatus,
          as: 'readStatuses',
          where: {
            user_id: userId,
            read_at: null
          },
          required: false
        }
      ]
    });

    if (unreadMessages.length === 0) {
      return res.json({
        success: true,
        message: 'No unread messages to mark as read'
      });
    }

    // Update message status to read
    await Message.update(
      { status: 'read' },
      {
        where: {
          id: {
            [Op.in]: unreadMessages.map(msg => msg.id)
          },
          status: { [Op.ne]: 'read' }
        }
      }
    );

    // Create or update read status
    const readStatuses = unreadMessages.map(msg => ({
      message_id: msg.id,
      user_id: userId,
      read_at: new Date()
    }));

    await MessageReadStatus.bulkCreate(readStatuses, {
      updateOnDuplicate: ['read_at']
    });

    res.json({
      success: true,
      message: 'Messages marked as read',
      data: { count: unreadMessages.length }
    });
  } catch (error) {
    next(error);
  }
};

// Get unread message count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.count({
      where: {
        [Op.and]: [
          { sender_id: { [Op.ne]: userId } }
        ]
      },
      include: [
        {
          model: Conversation,
          as: 'conversation',
          include: [
            {
              model: ConversationParticipant,
              as: 'participants',
              where: {
                user_id: userId
              }
            }
          ]
        },
        {
          model: MessageReadStatus,
          as: 'readStatuses',
          where: {
            user_id: userId,
            read_at: null
          },
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: { unread_count: unreadCount }
    });
  } catch (error) {
    next(error);
  }
};

// Get order-related conversations for admin
const getOrderConversations = async (req, res, next) => {
  try {
    // Only allow admin access
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access order conversations'
      });
    }

    const { page = 1, limit = 10, status = 'active' } = req.query;
    const offset = (page - 1) * limit;

    // Get conversations linked to orders/sales
    const { count, rows: orderConversations } = await OrderConversation.findAndCountAll({
      where: { status },
      include: [
        {
          model: Sale,
          as: 'sale',
          include: [
            {
              model: Vehicle,
              as: 'vehicle',
              attributes: ['id', 'make', 'model', 'year', 'price', 'images']
            },
            {
              model: Customer,
              as: 'customer',
              attributes: ['id', 'name', 'email', 'phone']
            }
          ]
        },
        {
          model: Conversation,
          as: 'conversation',
          include: [
            {
              model: Message,
              as: 'messages',
              attributes: {
                include: ['created_at', 'updated_at']  // Explicitly include timestamp fields
              },
              limit: 1,
              order: [['created_at', 'DESC']],
              include: [
                {
                  model: User,
                  as: 'sender',
                  attributes: ['id', 'full_name', 'role']
                }
              ]
            },
            {
              model: ConversationParticipant,
              as: 'participants',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'full_name', 'email', 'role']
                }
              ]
            }
          ]
        }
      ],
      order: [
        [{ model: Conversation, as: 'conversation' }, 'updatedAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Format the response to match the expected structure
    const formattedConversations = orderConversations.map(oc => ({
      id: oc.conversation?.id,
      name: oc.conversation?.name || `Order #${oc.sale_id} - ${oc.sale?.vehicle?.make} ${oc.sale?.vehicle?.model}`,
      type: 'order',
      status: oc.status,
      created_at: oc.conversation?.createdAt,
      updated_at: oc.conversation?.updatedAt,
      participants: oc.conversation?.participants?.map(p => ({
        id: p.user?.id,
        full_name: p.user?.full_name,
        email: p.user?.email,
        role: p.user?.role
      })) || [],
      last_message: oc.conversation?.messages?.[0] ? {
        content: oc.conversation.messages[0].content,
        sender: oc.conversation.messages[0].sender?.full_name,
        created_at: oc.conversation.messages[0].created_at
      } : null,
      order_info: {
        id: oc.sale?.id,
        sale_price: oc.sale?.sale_price,
        status: oc.sale?.status,
        vehicle: oc.sale?.vehicle,
        customer: oc.sale?.customer
      }
    }));

    res.json({
      success: true,
      data: formattedConversations,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  getOrderConversations
};