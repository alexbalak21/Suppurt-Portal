import { useState } from "react";
import FormErrorMessage from "../components/FormErrorMessage";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContainer";
import { Button, Input } from "../components";
import { register } from "../features/auth";
import { useAuth } from "../features/auth";
import { useUser } from "../features/user";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const { setAccessToken, setRefreshToken } = useAuth();
  const { setUser } = useUser();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password@1234",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill out all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token ?? null);
      setUser(response.data.user);

      toast.success("Registration successful! Redirecting to profile...");
      navigate("/profile");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">sign in to an existing account</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <FormErrorMessage message={error} />
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              label="Full name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="John Doe"
            />

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="your@mail.com"
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              fullWidth
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
