import { AppRoutes } from "./routes";
import { Navbar, ToastContainer } from "../components";
import { useUser } from "../features/user";

export default function App() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 w-full">
        <AppRoutes />
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
