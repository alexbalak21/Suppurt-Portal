import React from 'react';
import Message from './Message';

interface MessageData {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationProps {
  messages: MessageData[];
}

const Conversation: React.FC<ConversationProps> = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400 text-center">No messages in this conversation yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Conversation</h2>
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            senderId={message.senderId}
            body={message.body}
            createdAt={message.createdAt}
            updatedAt={message.updatedAt}
          />
        ))}
      </div>
    </div>
  );
};

export default Conversation;


