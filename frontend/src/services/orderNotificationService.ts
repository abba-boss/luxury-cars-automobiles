import { notificationService } from "@/services";

// Service to handle order-related notifications
export const orderNotificationService = {
  // Notify admin when a new order is created
  async notifyAdminNewOrder(order: any) {
    try {
      const notificationData = {
        user_id: order.admin_id, // Assuming there's an admin assigned to the order
        type: 'order_new',
        title: 'New Order Received',
        message: `New order #${order.id} for ${order.vehicle?.make} ${order.vehicle?.model} from ${order.customer?.full_name}`,
      };
      
      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify admin of new order:', error);
    }
  },

  // Notify customer when order status changes
  async notifyCustomerOrderUpdate(order: any, status: string) {
    try {
      const statusMessages: Record<string, string> = {
        pending: `Your order #${order.id} is being processed`,
        confirmed: `Your order #${order.id} has been confirmed!`,
        completed: `Your order #${order.id} has been completed!`,
        cancelled: `Your order #${order.id} has been cancelled`
      };

      const notificationData = {
        user_id: order.customer_id,
        type: 'order_update',
        title: 'Order Status Updated',
        message: statusMessages[status] || `Order #${order.id} status updated to ${status}`,
      };

      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify customer of order update:', error);
    }
  },

  // Notify customer when admin sends a message
  async notifyCustomerMessage(order: any, message: any) {
    try {
      const notificationData = {
        user_id: order.customer_id,
        type: 'order_message',
        title: 'New Message on Your Order',
        message: `Admin replied to your order #${order.id}: ${message.content.substring(0, 50)}...`,
      };

      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify customer of new message:', error);
    }
  },

  // Notify admin when customer sends a message
  async notifyAdminMessage(order: any, message: any) {
    try {
      const notificationData = {
        user_id: order.admin_id, // Assuming there's an admin assigned
        type: 'order_message',
        title: 'New Customer Message',
        message: `Customer sent a message on order #${order.id}: ${message.content.substring(0, 50)}...`,
      };

      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify admin of new message:', error);
    }
  }
};