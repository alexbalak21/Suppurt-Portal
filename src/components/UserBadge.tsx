import React from 'react';
import { useUsers } from '@features/user/useUsers';
import Avatar from './Avatar';

interface UserBadgeProps {
  userId?: number | null;
  userName?: string;
}

const UserBadge: React.FC<UserBadgeProps> = ({ userId, userName }) => {
  const { users } = useUsers();
  const isUnassigned = !userId;
  const user = users.find((user) => user.id === userId);
  const resolvedName = userName ?? user?.name;

  return (
    <span
      className={`inline-flex items-center px-1.5 py-1 rounded-full text-sm font-medium ${
        isUnassigned
          ? 'text-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600'
          : 'bg-white border-gray-300 dark:bg-gray-900 dark:text-blue-200 dark:border-gray-700'
      }`}
    >
      {!isUnassigned && (
        <span className="mr-2">
          <Avatar name={resolvedName || `User #${userId}`} size={20} />
        </span>
      )}
      {isUnassigned ? 'Unassigned' : resolvedName || `User #${userId}`}
    </span>
  );
};

export default UserBadge;
