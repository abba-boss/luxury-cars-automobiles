const {
  Conversation,
  ConversationParticipant,
  Message,
  MessageReadStatus,
  User
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
    const { count, rows: conversations } = await Conversation.findAndCountAll({
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
    });

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
          status: { [Op.ne]: 'read' }
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
    const { content, messageType = 'text', fileUrl, fileName } = req.body;
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

    // Get other participant in the conversation
    const otherParticipant = conversation.participants.find(p => p.user_id !== userId);
    if (!otherParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation participants'
      });
    }

    // Role-based access control
    if (req.user.role === 'admin') {
      // Admin can chat with anyone
    } else if (req.user.role === 'user') {
      // User can chat with admin or buyers
      if (otherParticipant.user.role === 'user') {
        return res.status(403).json({
          success: false,
          message: 'Users cannot chat with other users'
        });
      }
    } else if (req.user.role === 'buyer') {
      // Buyer can chat with users who contacted them and admin
      if (otherParticipant.user.role === 'buyer') {
        return res.status(403).json({
          success: false,
          message: 'Buyers cannot chat with other buyers'
        });
      }
    }

    // Create message
    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: userId,
      content,
      message_type: messageType,
      file_url: fileUrl,
      file_name: fileName
    });

    // Get full message with sender info
    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'full_name', 'role']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: fullMessage
    });
  } catch (error) {
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
      message: 'Messages marked as read'
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

module.exports = {
  createConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount
};