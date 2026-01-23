import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from "../components/shared/Input";
import Button from "../components/shared/Button";

export default function LoginForm() {
  const [email, setEmail] = useState('testuser@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
      navigate('/user');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full px-6 sm:px-6 lg:px-8">
      <div className="w-105 mx-auto">
        <h2 className="text-center text-3xl font-extrabold mb-8 text-gray-900">
          Sign in to your account
        </h2>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email address"
              placeholder="your@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
