import { useState } from "react";
import { useTheme } from "@features/theme/useTheme";
import type { Theme } from "@features/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { Button, Avatar } from "@components";
import { useUser } from "@features/user";
import { useRole } from "@features/auth/useRole";
import SimpleSelect from "@components/SimpleSelct";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { activeRole, setActiveRole } = useRole();
  const [loading] = useState(false);

  // Theme hook
  const { theme, setTheme } = useTheme();




  if (loading) {
    return <div className="text-center p-8 dark:bg-gray-900 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center p-8 dark:bg-gray-900 dark:text-white">No user loaded.</div>;
  }


  return (
    <div className="min-h-[calc(100vh-65px)] py-5 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 dark:shadow-lg dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold dark:text-white">User Profile</h2>
          <Button
            variant="secondary"
            onClick={() => navigate("/update-profile")}
          >
            Edit Profile
          </Button>
        </div>

        {/* Avatar only, no upload */}
        <div className="flex justify-center mb-6">
          <Avatar
            name={user?.name}
            imageData={user?.profileImage}
            size={96}
          />
        </div>

        {/* Theme selector */}
        <div className="flex gap-4 items-center mb-6">
          <strong className="w-28 text-gray-700 dark:text-gray-300">Theme:</strong>
          <SimpleSelect
            options={["light", "dark", "system"]}
            value={theme}
            onChange={(val) => setTheme(val as Theme)}
          />
        </div>

        {user && (

          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              <strong className="w-28 text-gray-700 dark:text-gray-300">Name:</strong>
              <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
            </div>
            <div className="flex gap-4 items-center">
              <strong className="w-28 text-gray-700 dark:text-gray-300">Email:</strong>
              <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
            </div>


            <div className="flex gap-4 items-center">
              <strong className="w-28 text-gray-700 dark:text-gray-300">Active Role:</strong>
              {user.roles.length > 1 ? (
                <SimpleSelect
                  options={user.roles}
                  value={activeRole || user.roles[0]}
                  onChange={setActiveRole}
                />
              ) : (
                <span className="text-gray-900 dark:text-gray-100">{user.roles[0]}</span>
              )}
            </div>

            {user.roles.length > 1 && (
              <div className="flex gap-4">
                <strong className="w-28 text-gray-700 dark:text-gray-300">All Roles:</strong>
                <span className="text-gray-900 dark:text-gray-100">{user.roles.join(", ")}</span>
              </div>
            )}

            <div className="flex gap-4">
              <strong className="w-28 text-gray-700 dark:text-gray-300">Created:</strong>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(user.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex gap-4">
              <strong className="w-28 text-gray-700 dark:text-gray-300">Updated:</strong>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(user.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
