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
  /**
   * 📤 Enviar un mensaje a otro usuario
   */
  sendMessage: async (fromUserId: number, data: SendMessageData): Promise<any> => {
    try {
      const payload = {
        car_id: data.carId,
        to_user: data.toUserId,
        body: data.content,
      };
      const res = await api.post('/api/messages', payload);
      return res.data;
    } catch (err) {
      // 🔄 Fallback local si el backend falla
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

  /**
   * 📂 Obtener todos los mensajes guardados localmente (fallback)
   */
  getMessages: (): Message[] => {
    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * 📥 Obtener inbox desde backend
   */
  getInbox: async (): Promise<Message[]> => {
    try {
      const res = await api.get('/api/messages/inbox');

      let data = res.data;

      // ✅ El backend devuelve { ok: true, messages: [...] }
      if (data && Array.isArray(data.messages)) {
        data = data.messages;
      } else if (Array.isArray(data)) {
        data = data;
      } else if (data && Array.isArray(data.data)) {
        data = data.data;
      } else {
        data = [];
      }

      // 🔄 Normalizar los campos para el frontend
      const normalized: Message[] = data.map((m: any) => ({
        id: m.id?.toString() ?? '',
        fromUserId: m.from_user ?? m.fromUserId ?? 0,
        toUserId: m.to_user ?? m.toUserId ?? 0,
        carId: m.car_id?.toString() ?? m.carId ?? '',
        subject: m.car_title || 'Mensaje',
        content: m.body || m.content || '',
        timestamp: new Date(m.created_at || Date.now()).getTime(),
        read: !!(m.read_flag || m.read),
      }));

      return normalized;
    } catch (err) {
      return messageService.getMessages();
    }
  },

  /**
   * 💬 Obtener hilo de mensajes por ID de auto
   */
  getThread: async (carId: number): Promise<Message[]> => {
    try {
      const res = await api.get(`/api/messages/thread/${carId}`);

      let data = res.data;
      if (data && Array.isArray(data.thread)) data = data.thread;
      else if (Array.isArray(data)) data = data;
      else data = [];

      const normalized: Message[] = data.map((m: any) => ({
        id: m.id?.toString() ?? '',
        fromUserId: m.from_user ?? m.fromUserId ?? 0,
        toUserId: m.to_user ?? m.toUserId ?? 0,
        carId: m.car_id?.toString() ?? m.carId ?? '',
        subject: m.car_title || 'Mensaje',
        content: m.body || m.content || '',
        timestamp: new Date(m.created_at || Date.now()).getTime(),
        read: !!(m.read_flag || m.read),
      }));

      return normalized;
    } catch (err) {
      return messageService.getMessages().filter(m => m.carId === String(carId));
    }
  },

  /**
   * ✅ Marcar un mensaje como leído
   */
  markAsRead: async (messageId: string | number): Promise<any> => {
    try {
      const res = await api.post(`/api/messages/${String(messageId)}/read`);
      return res.data;
    } catch (err) {
      // Fallback: actualizar localStorage
      const messages = messageService.getMessages();
      const msg = messages.find(m => m.id === String(messageId));
      if (msg) {
        msg.read = true;
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      }
      return { success: true };
    }
  },

  /**
   * 🗑️ Eliminar mensaje localmente (no afecta backend)
   */
  deleteMessage: (messageId: string): void => {
    const messages = messageService
      .getMessages()
      .filter(msg => msg.id !== messageId);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  },

  /**
   * 🧪 Crear un mensaje de ejemplo (modo desarrollo)
   */
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
  },
};
