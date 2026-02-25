import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContainer";
import FormErrorMessage from "../components/FormErrorMessage";
import { Button, Input } from "../components";
import { login } from "../features/auth";
import { useAuth } from "../features/auth";
import { useUser } from "../features/user";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const { setAccessToken, setRefreshToken } = useAuth();
  const { setUser, setActiveRole } = useUser();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "gordon.freeman@example.com",
    password: "password1234",
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

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email: formData.email, password: formData.password });

      // Store token and user

      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token ?? null);
      setUser(response.data.user);
      // Set activeRole to first available role after login
      if (response.data.user?.roles?.length) {
        setActiveRole(response.data.user.roles[0]);
      }

      toast.success("Login successful!");
      // Redirect support role to /support/dashboard
      if (response.data.user?.roles?.includes("SUPPORT")) {
        navigate("/support/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <FormErrorMessage message={error} />

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-indigo-400 dark:focus:ring-indigo-400"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              fullWidth
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
