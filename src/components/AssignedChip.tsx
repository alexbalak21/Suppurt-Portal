import React from 'react';
import { useUsers } from '../features/user/useUsers';

// Deprecated: Use UserBadge instead
interface UserBadgeProps {
  userId?: number | null;
  userName?: string;
}

const UserBadge: React.FC<UserBadgeProps> = ({ userId, userName }) => {
  const { users } = useUsers();
  const isUnassigned = !userId;
  const resolvedName = userName ?? users.find((user) => user.id === userId)?.name;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
        isUnassigned
          ? 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600'
          : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
      }`}
    >
     {isUnassigned ? 'Unassigned' : resolvedName || `User #${userId}`}
    </span>
  );
};

export default UserBadge;
