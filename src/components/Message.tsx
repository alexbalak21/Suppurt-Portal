import React from 'react';
import { useUser } from '../features/user';
import Avatar from './Avatar';

interface MessageProps {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

const Message: React.FC<MessageProps> = ({ id, senderId, body, createdAt, updatedAt }) => {
  const { user } = useUser();
  const isCurrentUser = user?.id === senderId;
  
  const formattedDate = new Date(createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {isCurrentUser ? (
            <Avatar name={user.name} imageUrl={user.profileImage} size={32} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
              {senderId}
            </div>
          )}
          <span className="text-sm font-semibold text-gray-700">
            {isCurrentUser ? user.name : `User ${senderId}`}
          </span>
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      <div className="ml-10 text-gray-800">{body}</div>
    </div>
  );
};

export default Message;
