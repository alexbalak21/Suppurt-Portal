import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, EditableText, Avatar } from "../../components";
import { useUser } from "../../features/user";
import { useRole } from "../../features/auth/useRole";
import { useAuth } from "../../features/auth";
import Select, { SelectOption } from "../../components/Select";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { activeRole, setActiveRole } = useRole();
  const { apiClient } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSaveName = async (newName: string) => {
    if (user) {
      setLoading(true);
      try {
        const response = await apiClient("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        });
        if (response.ok) {
          const updated = await response.json();
          setUser(updated);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEmail = async (newEmail: string) => {
    if (user) {
      setLoading(true);
      try {
        const response = await apiClient("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newEmail }),
        });
        if (response.ok) {
          const updated = await response.json();
          setUser(updated);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient("/api/user/profile-image", {
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
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">No user loaded.</div>;
  }

  // Convert roles → SelectOption[]
  const roleOptions: SelectOption[] = user.roles.map((role, index) => ({
    id: index,
    label: <span>{role}</span>
  }));

  // Ensure activeRole is a SelectOption
  const selectedRole: SelectOption =
    activeRole ?? roleOptions[0];

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">User Profile</h2>
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
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
            <span className="text-white text-xs">Upload</span>
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

      {user && (
        <div className="space-y-3">
          <EditableText
            label="Name"
            value={user.name}
            onSave={handleSaveName}
          />

          <EditableText
            label="Email"
            value={user.email}
            onSave={handleSaveEmail}
          />

          <div className="flex gap-4 items-center">
            <strong className="w-28 text-gray-700">Active Role:</strong>

            {roleOptions.length > 1 ? (
              <Select
                options={roleOptions}
                value={selectedRole}
                onChange={setActiveRole}
                renderOption={(opt) => opt.label}
              />
            ) : (
              <span className="text-gray-900">{roleOptions[0].label}</span>
            )}
          </div>

          {roleOptions.length > 1 && (
            <div className="flex gap-4">
              <strong className="w-28 text-gray-700">All Roles:</strong>
              <span className="text-gray-900">
                {user.roles.join(", ")}
              </span>
            </div>
          )}

          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Created:</strong>
            <span className="text-gray-900">
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Updated:</strong>
            <span className="text-gray-900">
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
