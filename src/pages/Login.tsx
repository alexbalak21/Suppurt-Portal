import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContainer";
import FormErrorMessage from "../components/FormErrorMessage";
import { Button, Input } from "../components";
import { login } from "@features/auth";
import { useAuth } from "@features/auth";
import { useUser } from "@features/user";

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
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const doLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await login({ email, password });
      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token ?? null);
      setUser(response.data.user);
      if (response.data.user?.roles?.length) {
        setActiveRole(response.data.user.roles[0]);
      }
      toast.success("Login successful!");
      if (response.data.user?.roles?.includes("MANAGER")) {
        navigate("/manager/dashboard");
      } else if (response.data.user?.roles?.includes("SUPPORT")) {
        navigate("/support/dashboard");
      } else if (response.data.user?.roles?.includes("USER")) {
        navigate("/user/dashboard");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    await doLogin(formData.email, formData.password);
  };

  const loginAs = (email: string) => {
    const password = "password1234";
    setFormData({ email, password });
    doLogin(email, password);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        {/* <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </Link>
        </p> */}
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

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Quick login as:
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => loginAs("manager@example.com")}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Manager
          </button>
          <button
            type="button"
            onClick={() => loginAs("gordon.freeman@example.com")}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            Support
          </button>
          <button
            type="button"
            onClick={() => loginAs("sarah.connor@example.com")}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            User
          </button>
        </div>
      </div>
    </div>
  );
}
