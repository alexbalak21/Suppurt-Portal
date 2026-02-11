import { useState } from "react";
import { useTheme } from "../../features/theme/useTheme";
import type { Theme } from "../../features/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { Button, EditableText, Avatar } from "../../components";
import { useUser, USER_ENDPOINTS } from "../../features/user";
import { useRole } from "../../features/auth/useRole";
import { useAuth } from "../../features/auth";
import SimpleSelect from "../../components/SimpleSelct";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { activeRole, setActiveRole } = useRole();
  const { apiClient } = useAuth();
  const [loading, setLoading] = useState(false);

  // Theme hook
  const { theme, setTheme } = useTheme();


  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient(USER_ENDPOINTS.profileImage, {
        method: "POST",
        body: formData,
      });
      if (response.ok && user) {
        const data = await response.json();
        setUser({ ...user, profileImage: data.imageData });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

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

        {/* Avatar with upload overlay */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <Avatar
              name={user?.name}
              imageUrl={user?.profileImage}
              size={96}
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity dark:bg-gray-800 dark:bg-opacity-70">
              <span className="text-white text-xs dark:text-gray-200">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProfileImageUpload(file);
                }}
              />
            </label>
          </div>
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
