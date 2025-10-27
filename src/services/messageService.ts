// messageService.ts - Servicio para gestión de mensajes entre usuarios

export interface Message {
  id: string;
  fromUserId: number;
  toUserId: number;
  carId: string;
  subject: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface SendMessageData {
  toUserId: number;
  carId: string;
  subject: string;
  content: string;
}

const MESSAGES_STORAGE_KEY = 'tuautonorte_messages';

import api from './api';

export const messageService = {
  sendMessage: async (fromUserId: number, data: SendMessageData): Promise<any> => {
    try {
      const payload = { car_id: data.carId, to_user: data.toUserId, body: data.content };
      const res = await api.post('/api/messages', payload);
      return res.data;
    } catch (err) {
      // fallback to localStorage mock
      const messages = messageService.getMessages();
      const newMessage: Message = {
        id: Date.now().toString(),
        fromUserId,
        toUserId: data.toUserId,
        carId: data.carId,
        subject: data.subject,
        content: data.content,
        timestamp: Date.now(),
        read: false,
      };

      messages.push(newMessage);
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));

      return newMessage;
    }
  },

  // Obtener todos los mensajes guardados localmente (fallback)
  getMessages: (): Message[] => {
    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Obtener inbox desde backend
  getInbox: async (): Promise<any[]> => {
    try {
      const res = await api.get('/api/messages/inbox');
      return res.data;
    } catch (err) {
      return messageService.getMessages();
    }
  },

  // Obtener hilo por auto
  getThread: async (carId: number): Promise<any[]> => {
    try {
      const res = await api.get(`/api/messages/thread/${carId}`);
      return res.data;
    } catch (err) {
  return messageService.getMessages().filter(m => m.carId === String(carId));
    }
  },

  markAsRead: async (messageId: string | number): Promise<any> => {
    try {
      const res = await api.post(`/api/messages/${String(messageId)}/read`);
      return res.data;
    } catch (err) {
      // fallback: update localStorage
      const messages = messageService.getMessages();
      const msg = messages.find(m => m.id === String(messageId));
      if (msg) {
        msg.read = true;
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      }
      return { success: true };
    }
  },

  deleteMessage: (messageId: string): void => {
    const messages = messageService.getMessages().filter(msg => msg.id !== messageId);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  },

  createExampleMessage: (toUserId: number): void => {
    const messages = messageService.getMessages();
    const existingExample = messages.find(msg => msg.id.startsWith('example-'));
    if (existingExample) return;

    const exampleMessage: Message = {
      id: `example-${Date.now()}`,
      fromUserId: 999,
      toUserId,
      carId: 'example-car-1',
      subject: '¡Interesado en tu Toyota Corolla!',
      content: `Hola! 👋\n\nVi tu Toyota Corolla publicado en TuAutoNorte y me encantó...`,
      timestamp: Date.now() - 1800000,
      read: false,
    };

    messages.push(exampleMessage);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }
};