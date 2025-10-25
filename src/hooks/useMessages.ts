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

    const updateUnreadCount = () => {
      try {
        const receivedMessages = messageService.getReceivedMessages(user.id);
        const unread = receivedMessages.filter(msg => !msg.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error updating unread count:', error);
        setUnreadCount(0);
      }
    };

    updateUnreadCount();
  }, [user]);

  return { unreadCount };
};