import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Avatar } from "../../components";
import { EditableText } from "../../components";
import { useUser, USER_ENDPOINTS } from "../../features/user";
import { useAuth } from "../../features/auth";

export default function UpdateProfile() {
    const handleSaveName = async (newName: string) => {
      if (user) {
        setSubmitting(true);
        try {
          const response = await apiClient(USER_ENDPOINTS.userUpdate, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
          });
          if (response.ok) {
            const updated = await response.json();
            setUser({
              ...user,
              ...updated,
            });
            setFormData((prev) => ({ ...prev, name: updated.name }));
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          } else {
            throw new Error("Failed to update name");
          }
        } catch (err: any) {
          setError(err?.message || "Failed to update name");
        } finally {
          setSubmitting(false);
        }
      }
    };

    const handleSaveEmail = async (newEmail: string) => {
      if (user) {
        setSubmitting(true);
        try {
          const response = await apiClient(USER_ENDPOINTS.userUpdate, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: newEmail }),
          });
          if (response.ok) {
            const updated = await response.json();
            setUser({
              ...user,
              ...updated,
            });
            setFormData((prev) => ({ ...prev, email: updated.email }));
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          } else {
            throw new Error("Failed to update email");
          }
        } catch (err: any) {
          setError(err?.message || "Failed to update email");
        } finally {
          setSubmitting(false);
        }
      }
    };
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { apiClient } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiClient(USER_ENDPOINTS.me, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updated = await response.json();
      setUser(updated);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      console.error("Update failed:", err);
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
    } finally {
      setSubmitting(false);
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
    <div className="min-h-[calc(100vh-65px)] ps-10 pb-30 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 min-w-100">
        {/* Upload profile image at the top */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <Avatar
              name={user.name}
              imageUrl={user.profileImage}
              size={96}
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
              <span className="text-white text-xs">Change</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </label>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Update Profile</h2>
          <p className="mt-2 text-sm text-gray-600">Update your account information</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
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
                <p className="text-sm font-medium text-green-800">
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
              setSubmitting(true);
              setError(null);
              try {
                const response = await apiClient(USER_ENDPOINTS.userUpdate, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: newName }),
                });
                if (!response.ok) throw new Error("Failed to update name");
                const updated = await response.json();
                setUser(updated);
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 2000);
              } catch (err: any) {
                setError(err?.message || "Failed to update name");
              } finally {
                setSubmitting(false);
              }
            }}
          />
          <EditableText
            label="Email"
            value={user.email}
            onSave={async (newEmail: string) => {
              setSubmitting(true);
              setError(null);
              try {
                const response = await apiClient(USER_ENDPOINTS.userUpdate, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: newEmail }),
                });
                if (!response.ok) throw new Error("Failed to update email");
                const updated = await response.json();
                setUser(updated);
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 2000);
              } catch (err: any) {
                setError(err?.message || "Failed to update email");
              } finally {
                setSubmitting(false);
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            onClick={() => navigate("/profile")}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
