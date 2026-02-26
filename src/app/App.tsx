import { AppRoutes } from "./routes";
import { Navbar, ToastContainer } from "../components";
import { useUser } from "@features/user";
import { useAuth } from "@features/auth";
import { useTheme } from "@features/theme/useTheme";

export default function App() {
  const { user } = useUser();
  const { accessToken } = useAuth();
  useTheme(); // Ensure theme is applied globally

  // Key the entire app content by user identity so all component state
  // is flushed when switching accounts (prevents stale cached data)
  const sessionKey = `${user?.id ?? 'anon'}-${accessToken?.slice(-8) ?? 'none'}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Navbar user={user} />
      <div className="flex-1 w-full" key={sessionKey}>
        <AppRoutes />
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
