import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, message: string) => void;
  loading?: boolean;
}

const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(parseFloat(amount), message);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hacer Oferta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          placeholder="Monto de la oferta"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <textarea
          placeholder="Mensaje opcional"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
        <div className="flex space-x-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Enviando...' : 'Enviar Oferta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OfferModal;