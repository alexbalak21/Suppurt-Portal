import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, EditableText } from "@components";
import { useUser, USER_ENDPOINTS } from "@features/user";
import { useAuth } from "@features/auth";
import { PencilIcon } from "@heroicons/react/24/outline";
import UpdateUserPassword from "./UpdateUserPassword";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function UpdateProfile() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { apiClient } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize form with user data when available
  // Removed setFormData usage as formData state is gone

  
  const handleImageDelete = async () => {
    try {
      const response = await apiClient(USER_ENDPOINTS.profileImage, {
        method: "DELETE",
      });
      if (response.ok && user) {
        setUser({ ...user, profileImage: null });
      }
    } catch (err) {
      console.error("Image delete failed:", err);
    }
  };


  const handleImageUpload = async (file: File) => {
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await apiClient(USER_ENDPOINTS.profileImage, {
        method: "POST",
        body: form,
      });

      if (response.ok && user) {
        const data = await response.json();
        setUser({ ...user, profileImage: data.imageData });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] px-4 sm:ps-8 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        {/* Upload profile image at the top */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <Avatar
              name={user.name}
              imageData={user.profileImage}
              size={96}
            />
            <div className="flex justify-center mt-2">
              <div className="flex gap-1 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-full p-1 shadow-md transition-opacity opacity-80 hover:opacity-100">
                <label className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  <ArrowUpTrayIcon className="h-6 w-6 text-gray-500" />
                </label>
                {user.profileImage && (
                  <button
                    type="button"
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleImageDelete}
                    aria-label="Remove profile image"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Update Profile</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Update your account information</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 rounded-md">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-green-400 dark:text-green-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Your profile has been updated!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EditableText fields for name and email */}
        <div className="space-y-3 mb-6">
          <EditableText
            label="Name"
            value={user.name}
            onSave={async (newName: string) => {
              setError(null);
              try {
                const response = await apiClient(USER_ENDPOINTS.userUpdate, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: newName }),
                });
                if (!response.ok) throw new Error("Failed to update name");
                const updated = await response.json();
                setUser({ ...user, ...updated });
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 2000);
              } catch (err: any) {
                setError(err?.message || "Failed to update name");
              } finally {
                // setSubmitting removed
              }
            }}
          />
          <EditableText
            label="Email"
            value={user.email}
            onSave={async (newEmail: string) => {
              setError(null);
              try {
                const response = await apiClient(USER_ENDPOINTS.userUpdate, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: newEmail }),
                });
                if (!response.ok) throw new Error("Failed to update email");
                const updated = await response.json();
                setUser({ ...user, ...updated });
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 2000);
              } catch (err: any) {
                setError(err?.message || "Failed to update email");
              } finally {
                // setSubmitting removed
              }
            }}
          />

          <div className="flex gap-4 items-center">
            <strong className="w-28 text-gray-700 dark:text-gray-300 text-center">Password:</strong>
            <div className="flex items-center justify-between flex-1">
              <span className="text-gray-900 dark:text-white">••••••••</span>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-1 rounded-md hover:bg-gray-100 ms-5"
              >
                <PencilIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            onClick={() => navigate("/profile")}
            variant="secondary"
            className="w-full sm:w-auto dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Back
          </Button>
        </div>

        {showPasswordModal && (
          <UpdateUserPassword onClose={() => setShowPasswordModal(false)} />
        )}
      </div>
    </div>
  );
}
