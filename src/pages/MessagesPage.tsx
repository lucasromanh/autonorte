import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { messageService, type Message } from '@/services/messageService';
import Button from '@/components/ui/Button';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let messagesToShow;
    if (activeTab === 'received') {
      messagesToShow = messageService.getReceivedMessages(user.id);
      // Si no hay mensajes recibidos, crear uno de ejemplo
      if (messagesToShow.length === 0) {
        messageService.createExampleMessage(user.id);
        messagesToShow = messageService.getReceivedMessages(user.id);
      }
    } else {
      messagesToShow = messageService.getSentMessages(user.id);
    }
    setMessages(messagesToShow);
    setLoading(false);
  }, [user, activeTab]);

  const handleMarkAsRead = (messageId: string) => {
    messageService.markAsRead(messageId);
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
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
          📥 Recibidos ({messageService.getReceivedMessages(user.id).length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📤 Enviados ({messageService.getSentMessages(user.id).length})
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