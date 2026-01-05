const sequelize = require('../config/database');
const User = require('./User');
const Vehicle = require('./Vehicle');
const Customer = require('./Customer');
const Sale = require('./Sale');
const Inquiry = require('./Inquiry');
const Review = require('./Review');
const Booking = require('./Booking');
const Favorite = require('./Favorite');
const Notification = require('./Notification');
const Brand = require('./Brand');
const Conversation = require('./Conversation');
const ConversationParticipant = require('./ConversationParticipant');
const Message = require('./Message');
const MessageReadStatus = require('./MessageReadStatus');

// Initialize all models
const models = {
  User,
  Vehicle,
  Customer,
  Sale,
  Inquiry,
  Review,
  Booking,
  Favorite,
  Notification,
  Brand,
  Conversation,
  ConversationParticipant,
  Message,
  MessageReadStatus
};

// Set up associations
User.hasMany(models.Customer, { foreignKey: 'user_id', as: 'customers' });
models.Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Vehicle.hasMany(models.Sale, { foreignKey: 'vehicle_id', as: 'sales' });
models.Sale.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

models.Customer.hasMany(models.Sale, { foreignKey: 'customer_id', as: 'sales' });
models.Sale.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });

User.hasMany(models.Sale, { foreignKey: 'user_id', as: 'sales' });
models.Sale.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Vehicle.hasMany(models.Inquiry, { foreignKey: 'vehicle_id', as: 'inquiries' });
models.Inquiry.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(models.Inquiry, { foreignKey: 'user_id', as: 'inquiries' });
models.Inquiry.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// New associations
User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
models.Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Vehicle.hasMany(models.Review, { foreignKey: 'vehicle_id', as: 'reviews' });
models.Review.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(models.Booking, { foreignKey: 'user_id', as: 'bookings' });
models.Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Vehicle.hasMany(models.Booking, { foreignKey: 'vehicle_id', as: 'bookings' });
models.Booking.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(models.Favorite, { foreignKey: 'user_id', as: 'favorites' });
models.Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Vehicle.hasMany(models.Favorite, { foreignKey: 'vehicle_id', as: 'favorites' });
models.Favorite.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
models.Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Brand associations
models.Brand.hasMany(models.Vehicle, { foreignKey: 'brand_id', as: 'vehicles' });
models.Vehicle.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });

// Chat associations
User.hasMany(models.Conversation, { foreignKey: 'created_by', as: 'createdConversations' });
models.Conversation.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

models.Conversation.hasMany(models.ConversationParticipant, { foreignKey: 'conversation_id', as: 'participants' });
models.ConversationParticipant.belongsTo(models.Conversation, { foreignKey: 'conversation_id', as: 'conversation' });

User.hasMany(models.ConversationParticipant, { foreignKey: 'user_id', as: 'participatedConversations' });
models.ConversationParticipant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

models.Conversation.hasMany(models.Message, { foreignKey: 'conversation_id', as: 'messages' });
models.Message.belongsTo(models.Conversation, { foreignKey: 'conversation_id', as: 'conversation' });

User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'sentMessages' });
models.Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

models.Message.hasMany(models.MessageReadStatus, { foreignKey: 'message_id', as: 'readStatuses' });
models.MessageReadStatus.belongsTo(models.Message, { foreignKey: 'message_id', as: 'message' });

User.hasMany(models.MessageReadStatus, { foreignKey: 'user_id', as: 'messageReadStatuses' });
models.MessageReadStatus.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Parent message association for replies
models.Message.belongsTo(models.Message, { foreignKey: 'parent_message_id', as: 'parentMessage' });
models.Message.hasMany(models.Message, { foreignKey: 'parent_message_id', as: 'replies' });

module.exports = {
  sequelize,
  ...models
};
