import React, { useState } from 'react';
import { useAuth } from '../features/auth';
import Button from './Button';

interface AddMessageProps {
  ticketId: string;
  onMessageAdded: () => void;
}

const AddMessage: React.FC<AddMessageProps> = ({ ticketId, onMessageAdded }) => {
  const { apiClient } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiClient(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to post message');
      }

      setMessage('');
      onMessageAdded();
    } catch (err: any) {
      setError(err.message || 'Error posting message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Add a Message</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
        />
        {error && (
          <div className="mt-2 text-sm text-red-600">{error}</div>
        )}
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !message.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Message'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMessage;
