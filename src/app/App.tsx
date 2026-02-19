import { AppRoutes } from "./routes";
import { Navbar, ToastContainer } from "../components";
import { useUser } from "../features/user";
import { useTheme } from "../features/theme/useTheme";

export default function App() {
  const { user } = useUser();
  useTheme(); // Ensure theme is applied globally

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Navbar user={user} />
      <div className="flex-1 w-full">
        <AppRoutes />
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
