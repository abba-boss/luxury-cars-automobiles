import { notificationService } from "./index";
import { saleService } from "./index";
import { chatService } from "./chatService";

// Enhanced service to handle all user-admin communication notifications
export const notificationManager = {
  // Notify admin when a new order is created
  async notifyAdminNewOrder(order: any) {
    try {
      const adminUsers = await this.getAdminUsers();
      for (const admin of adminUsers) {
        const notificationData = {
          user_id: admin.id,
          type: 'order_new',
          title: 'New Order Received',
          message: `New order #${order.id} for ${order.vehicle?.make} ${order.vehicle?.model} from ${order.customer?.full_name || order.user?.email}`,
        };

        await notificationService.createNotification(notificationData);
      }
    } catch (error) {
      console.error('Failed to notify admin of new order:', error);
    }
  },

  // Notify customer when order status changes
  async notifyCustomerOrderUpdate(order: any, status: string, updatedBy?: string) {
    try {
      const statusMessages: Record<string, string> = {
        pending: `Your order #${order.id} is being processed`,
        confirmed: `Your order #${order.id} has been confirmed!`,
        processing: `Your order #${order.id} is being prepared`,
        shipped: `Your order #${order.id} has been shipped`,
        delivered: `Your order #${order.id} has been delivered`,
        completed: `Your order #${order.id} has been completed!`,
        cancelled: `Your order #${order.id} has been cancelled`,
        refunded: `Your order #${order.id} has been refunded`
      };

      const notificationData = {
        user_id: order.customer_id || order.user_id,
        type: 'order_update',
        title: 'Order Status Updated',
        message: statusMessages[status] || `Order #${order.id} status updated to ${status}${updatedBy ? ` by ${updatedBy}` : ''}`,
      };

      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify customer of order update:', error);
    }
  },

  // Notify admin when customer sends a message in order conversation
  async notifyAdminMessage(order: any, message: any, customerName?: string) {
    try {
      // Get admin users who can receive order notifications
      const adminUsers = await this.getAdminUsers();
      
      for (const admin of adminUsers) {
        const notificationData = {
          user_id: admin.id,
          type: 'order_message',
          title: 'New Customer Message',
          message: `Customer ${customerName || 'sent'} a message on order #${order.id}: "${message.content.substring(0, 50)}..."`,
        };

        await notificationService.createNotification(notificationData);
      }
    } catch (error) {
      console.error('Failed to notify admin of new message:', error);
    }
  },

  // Notify customer when admin sends a message in order conversation
  async notifyCustomerMessage(order: any, message: any, adminName?: string) {
    try {
      const notificationData = {
        user_id: order.customer_id || order.user_id,
        type: 'order_message',
        title: 'New Message on Your Order',
        message: `Admin ${adminName || 'replied'} to your order #${order.id}: "${message.content.substring(0, 50)}..."`,
      };

      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify customer of new message:', error);
    }
  },

  // Notify customer when admin updates payment status
  async notifyCustomerPaymentUpdate(order: any, paymentStatus: string, adminName?: string) {
    try {
      const statusMessages: Record<string, string> = {
        pending: `Payment for order #${order.id} is pending`,
        completed: `Payment for order #${order.id} has been completed`,
        failed: `Payment for order #${order.id} failed`,
        refunded: `Payment for order #${order.id} has been refunded`
      };

      const notificationData = {
        user_id: order.customer_id || order.user_id,
        type: 'payment_update',
        title: 'Payment Status Updated',
        message: statusMessages[paymentStatus] || `Payment status for order #${order.id} updated to ${paymentStatus}${adminName ? ` by ${adminName}` : ''}`,
      };

      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify customer of payment update:', error);
    }
  },

  // Notify admin when customer updates their profile information
  async notifyAdminProfileUpdate(user: any, updatedFields: string[]) {
    try {
      const adminUsers = await this.getAdminUsers();
      for (const admin of adminUsers) {
        const notificationData = {
          user_id: admin.id,
          type: 'profile_update',
          title: 'Customer Profile Updated',
          message: `Customer ${user.full_name || user.email} updated their ${updatedFields.join(', ')}`,
        };

        await notificationService.createNotification(notificationData);
      }
    } catch (error) {
      console.error('Failed to notify admin of profile update:', error);
    }
  },

  // Get all admin users
  async getAdminUsers() {
    try {
      // This would typically come from an API call
      // For now, we'll simulate getting admin users
      // In a real implementation, this would call an API endpoint
      const response = await fetch('/api/users?role=admin');
      if (response.ok) {
        return await response.json();
      }
      // Fallback: return empty array
      return [];
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      return [];
    }
  },

  // Batch notification for multiple admins
  async notifyAdmins(title: string, message: string, type: string = 'general') {
    try {
      const adminUsers = await this.getAdminUsers();
      for (const admin of adminUsers) {
        const notificationData = {
          user_id: admin.id,
          type,
          title,
          message,
        };

        await notificationService.createNotification(notificationData);
      }
    } catch (error) {
      console.error('Failed to notify admins:', error);
    }
  },

  // Notify about low inventory
  async notifyLowInventory(vehicle: any) {
    try {
      const notificationData = {
        user_id: 1, // Default admin user ID
        type: 'inventory_alert',
        title: 'Low Inventory Alert',
        message: `Inventory for ${vehicle.make} ${vehicle.model} is running low (${vehicle.quantity} remaining)`,
      };

      await notificationService.createNotification(notificationData);
    } catch (error) {
      console.error('Failed to notify about low inventory:', error);
    }
  }
};