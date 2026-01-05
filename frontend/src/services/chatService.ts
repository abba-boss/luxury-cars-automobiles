import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
  status: string;
  created_at: string;
  updated_at: string;
  sender: {
    id: number;
    full_name: string;
    role: string;
  };
}

interface Conversation {
  id: number;
  name?: string;
  type: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  participants: Array<{
    id: number;
    user_id: number;
    role: string;
    user: {
      id: number;
      full_name: string;
      email: string;
      role: string;
    };
  }>;
  messages: Message[];
  unread_count: number;
}

interface CreateConversationRequest {
  recipientId: number;
}

interface SendMessageRequest {
  content: string;
  messageType?: string;
  fileUrl?: string;
  fileName?: string;
}

class ChatService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  constructor(private token: string | null) {}

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async createConversation(data: CreateConversationRequest): Promise<{ success: boolean; message: string; data?: Conversation }> {
    const response = await fetch(`${this.baseUrl}/chat/conversations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  async getUserConversations(params?: { page?: number; limit?: number; status?: string }): Promise<{ success: boolean; data: Conversation[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = `${this.baseUrl}/chat/conversations${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getHeaders()
    });

    return await response.json();
  }

  async getConversationMessages(conversationId: string, params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: Message[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `${this.baseUrl}/chat/conversations/${conversationId}/messages${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getHeaders()
    });

    return await response.json();
  }

  async sendMessage(conversationId: string, data: SendMessageRequest): Promise<{ success: boolean; message: string; data: Message }> {
    const response = await fetch(`${this.baseUrl}/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  async markMessagesAsRead(conversationId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/chat/conversations/${conversationId}/read`, {
      method: 'POST',
      headers: this.getHeaders()
    });

    return await response.json();
  }

  async getUnreadCount(): Promise<{ success: boolean; data: { unread_count: number } }> {
    const response = await fetch(`${this.baseUrl}/chat/unread-count`, {
      headers: this.getHeaders()
    });

    return await response.json();
  }
}

export const useChatService = () => {
  const { token } = useAuth();
  return new ChatService(token);
};

export type { Message, Conversation, CreateConversationRequest, SendMessageRequest };