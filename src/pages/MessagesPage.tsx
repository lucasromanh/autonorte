import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { messageService, type Message } from '@/services/messageService';
import Button from '@/components/ui/Button';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [receivedCount, setReceivedCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      setReceivedCount(0);
      setSentCount(0);
      return;
    }

    let mounted = true;
    setLoading(true);
    const load = async () => {
      try {
        if (activeTab === 'received') {
          let inbox: any = [];
          if (typeof messageService.getInbox === 'function') {
            inbox = await messageService.getInbox();
          } else if (typeof messageService.getMessages === 'function') {
            inbox = messageService.getMessages().filter(m => m.toUserId === user.id);
          }

          // Normalizar a array
          if (!Array.isArray(inbox)) {
            if (inbox && Array.isArray(inbox.messages)) inbox = inbox.messages;
            else if (inbox && Array.isArray(inbox.data)) inbox = inbox.data;
            else if (inbox && Array.isArray(inbox.inbox)) inbox = inbox.inbox;
            else inbox = [];
          }

          // Si no hay mensajes recibidos, crear uno de ejemplo
          if (inbox.length === 0 && typeof messageService.createExampleMessage === 'function') {
            messageService.createExampleMessage(user.id);
            inbox = messageService.getMessages().filter(m => m.toUserId === user.id);
          }

          if (mounted) setMessages(inbox as Message[]);
        } else {
          // Sent messages: backend may not expose a dedicated endpoint; try service function else fallback
          let sent: any = [];
          if (typeof (messageService as any).getSentMessages === 'function') {
            sent = (messageService as any).getSentMessages(user.id);
          } else if (typeof messageService.getMessages === 'function') {
            sent = messageService.getMessages().filter(m => m.fromUserId === user.id);
          }

          if (!Array.isArray(sent)) {
            if (sent && Array.isArray(sent.messages)) sent = sent.messages;
            else if (sent && Array.isArray(sent.data)) sent = sent.data;
            else sent = [];
          }
          if (mounted) setMessages(sent as Message[]);
        }

        // update counts
        try {
          let inboxAll: any = [];
          if (typeof messageService.getInbox === 'function') inboxAll = await messageService.getInbox();
          else if (typeof messageService.getMessages === 'function') inboxAll = messageService.getMessages().filter(m => m.toUserId === user.id);
          if (!Array.isArray(inboxAll)) {
            if (inboxAll && Array.isArray(inboxAll.messages)) inboxAll = inboxAll.messages;
            else if (inboxAll && Array.isArray(inboxAll.data)) inboxAll = inboxAll.data;
            else inboxAll = [];
          }

          let sentAll: any = [];
          if (typeof (messageService as any).getSentMessages === 'function') sentAll = (messageService as any).getSentMessages(user.id);
          else if (typeof messageService.getMessages === 'function') sentAll = messageService.getMessages().filter(m => m.fromUserId === user.id);
          if (!Array.isArray(sentAll)) {
            if (sentAll && Array.isArray(sentAll.messages)) sentAll = sentAll.messages;
            else if (sentAll && Array.isArray(sentAll.data)) sentAll = sentAll.data;
            else sentAll = [];
          }

          if (mounted) {
            setReceivedCount(Array.isArray(inboxAll) ? inboxAll.length : 0);
            setSentCount(Array.isArray(sentAll) ? sentAll.length : 0);
          }
        } catch {}

      } catch (err) {
        console.error('Error loading messages:', err);
        if (mounted) setMessages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [user, activeTab]);

  const handleMarkAsRead = async (messageId: string | number) => {
    try {
      await messageService.markAsRead(messageId as any);
    } catch (err) {
      console.warn('markAsRead failed:', err);
    }
    setMessages(prev => prev.map(msg =>
      msg.id === String(messageId) ? { ...msg, read: true } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      messageService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Mensajes</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus conversaciones con vendedores e interesados
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📥 Recibidos ({receivedCount})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📤 Enviados ({sentCount})
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeTab === 'received' ? 'No tienes mensajes recibidos' : 'No has enviado mensajes'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {activeTab === 'received'
                ? 'Cuando alguien se interese en tus publicaciones, recibirás mensajes aquí.'
                : 'Los mensajes que envíes a otros usuarios aparecerán en esta pestaña.'
              }
            </p>
            {activeTab === 'received' && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 Para ver cómo funciona, hemos creado un mensaje de ejemplo.
              </p>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
                message.read ? 'border-gray-300 dark:border-gray-600' : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeTab === 'received' ? 'De:' : 'Para:'} {
                      activeTab === 'received' ? `Usuario ${message.fromUserId}` : `Usuario ${message.toUserId}`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(message.timestamp)}
                  </p>
                  {!message.read && activeTab === 'received' && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                {message.content}
              </p>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID del auto: {message.carId}
                </p>
                <div className="flex space-x-2">
                  {activeTab === 'received' && !message.read && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      Marcar como leído
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesPage;