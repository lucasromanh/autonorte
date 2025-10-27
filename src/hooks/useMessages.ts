// useMessages.ts - Hook personalizado para gestión de mensajes
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { messageService } from '@/services/messageService';

export const useMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    let mounted = true;
    const updateUnreadCount = async () => {
      try {
        let receivedMessages: any = [];
        if (typeof messageService.getInbox === 'function') {
          receivedMessages = await messageService.getInbox();
        } else if (typeof messageService.getMessages === 'function') {
          receivedMessages = messageService.getMessages();
        }

        // Normalizar a array
        if (!Array.isArray(receivedMessages)) {
          // intentar extraer propiedades comunes
          if (receivedMessages && Array.isArray(receivedMessages.messages)) receivedMessages = receivedMessages.messages;
          else if (receivedMessages && Array.isArray(receivedMessages.data)) receivedMessages = receivedMessages.data;
          else if (receivedMessages && Array.isArray(receivedMessages.inbox)) receivedMessages = receivedMessages.inbox;
          else receivedMessages = [];
        }

        const unread = receivedMessages.filter((msg: any) => (msg.read === false) || (msg.read_flag === 0)).length;
        if (mounted) setUnreadCount(unread);
      } catch (error) {
        console.error('Error updating unread count:', error);
        if (mounted) setUnreadCount(0);
      }
    };

    updateUnreadCount();
    return () => { mounted = false; };
  }, [user]);

  return { unreadCount };
};