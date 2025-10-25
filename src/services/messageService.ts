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

export const messageService = {
  // Enviar un mensaje
  sendMessage: async (fromUserId: number, data: SendMessageData): Promise<Message> => {
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
  },

  // Obtener todos los mensajes
  getMessages: (): Message[] => {
    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Obtener mensajes recibidos por un usuario
  getReceivedMessages: (userId: number): Message[] => {
    return messageService.getMessages()
      .filter(msg => msg.toUserId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  // Obtener mensajes enviados por un usuario
  getSentMessages: (userId: number): Message[] => {
    return messageService.getMessages()
      .filter(msg => msg.fromUserId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  // Marcar mensaje como leído
  markAsRead: (messageId: string): void => {
    const messages = messageService.getMessages();
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      message.read = true;
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  },

  // Obtener mensaje por ID
  getMessageById: (messageId: string): Message | null => {
    return messageService.getMessages().find(msg => msg.id === messageId) || null;
  },

  // Eliminar mensaje
  deleteMessage: (messageId: string): void => {
    const messages = messageService.getMessages().filter(msg => msg.id !== messageId);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  },

  // Crear mensaje de ejemplo para testing
  createExampleMessage: (toUserId: number): void => {
    const messages = messageService.getMessages();
    // Verificar si ya existe un mensaje de ejemplo
    const existingExample = messages.find(msg => msg.id.startsWith('example-'));
    if (existingExample) return;

    const exampleMessage: Message = {
      id: `example-${Date.now()}`,
      fromUserId: 999, // Usuario de ejemplo
      toUserId,
      carId: 'example-car-1',
      subject: '¡Interesado en tu Toyota Corolla!',
      content: `Hola! 👋

Vi tu Toyota Corolla publicado en TuAutoNorte y me encantó. Es exactamente lo que estoy buscando para mi día a día.

Me gustaría saber:
• ¿Cuántos kilómetros tiene realmente?
• ¿El mantenimiento está al día?
• ¿Tiene todos los papeles en regla?
• ¿Aceptarías un intercambio por mi moto?

El precio me parece muy razonable. ¿Podríamos acordar una cita para verlo?

¡Espero tu respuesta!
Saludos,
Carlos Rodríguez
📱 555-0123`,
      timestamp: Date.now() - 1800000, // 30 minutos atrás
      read: false,
    };

    messages.push(exampleMessage);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  },
};