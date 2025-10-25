import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement password reset API call
    setMessage('Se ha enviado un enlace de restablecimiento a tu email');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {message && <p className="text-green-500">{message}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
      </Button>
    </form>
  );
};

export default PasswordResetForm;