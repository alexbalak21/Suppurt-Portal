import React from "react";
import { useUser, useUsers } from "../features/user";
import Avatar from "./Avatar";

interface MessageProps {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

const Message: React.FC<MessageProps> = ({ id, senderId, body, createdAt, updatedAt }) => {
  const { user } = useUser();
  const { users } = useUsers();
  const isCurrentUser = user?.id === senderId;
  const sender = users.find(u => u.id === senderId);
  
  const formattedDate = new Date(createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (isCurrentUser) {
    return (
      <div className="flex justify-end gap-3 items-start">
        <div className="flex flex-col items-end max-w-[70%]">
          <div className="flex flex-col items-end mb-1">
            <span className="text-sm font-semibold text-gray-700">{user.name}</span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <div className="bg-indigo-600 text-white rounded-lg p-4 shadow-sm text-base">
            {body}
          </div>
        </div>
        <Avatar name={user.name} imageData={user.profileImage} size={40} />
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 items-start">
      <Avatar name={sender?.name ?? `User ${senderId}`} size={40} />
      <div className="flex flex-col items-start max-w-[70%]">
        <div className="flex flex-col items-start mb-1">
          <span className="text-sm font-semibold text-gray-700">
            {sender?.name ?? `User ${senderId}`}
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-base">
          {body}
        </div>
      </div>
    </div>
  );
};

export default Message;
