import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spinner } from "../components/Spinner";
import { UserLayout } from "../components";
import { UserIcon, PencilSquareIcon, KeyIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@features/auth";
import { useRole } from "@features/auth/useRole";

// Route-level code splitting — each page is only downloaded when first visited
const About = lazy(() => import("../pages/About"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/User/Profile"));
const UpdateProfile = lazy(() => import("../pages/User/UpdateProfile"));
const UpdateUserPassword = lazy(() => import("../pages/User/UpdateUserPassword"));
const UserDashboard = lazy(() => import("../pages/User/userDashboard"));
const CreateTicketPage = lazy(() => import("../pages/Ticket/CreateTicketPage"));
const TicketListPage = lazy(() => import("../pages/Ticket/TicketListPage"));
const TicketDetailsPage = lazy(() => import("../pages/Ticket/TicketDetailsPage"));
const SupportDashboard = lazy(() => import("../pages/Support/SupportDashboard"));
const ManagerDashboard = lazy(() => import("../pages/Manager/ManagerDashboard"));

const userLinks = [
  { name: "Dashboard", href: "/user/dashboard", icon: HomeIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
  { name: "Edit Profile", href: "/update-profile", icon: PencilSquareIcon },
  { name: "Update Password", href: "/update-password", icon: KeyIcon },
];

function RootRedirect() {
  const { accessToken } = useAuth();
  const { isManager, isSupport, isUser } = useRole();

  if (!accessToken) return <Navigate to="/login" replace />;
  if (isManager) return <Navigate to="/manager/dashboard" replace />;
  if (isSupport) return <Navigate to="/support/dashboard" replace />;
  if (isUser) return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

export function AppRoutes() {
  const pageFallback = (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner size="md" color="primary" />
    </div>
  );

  return (
    <Suspense fallback={pageFallback}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Normal pages without sidebar */}
        <Route path="/about" element={<About />} />
        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/ticket-list" element={<TicketListPage />} />
        <Route path="/ticket/:id" element={<TicketDetailsPage />} />
        <Route path="/support/tickets" element={<TicketListPage />} />
        <Route path="/support/dashboard" element={<SupportDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User-related pages with sidebar */}
        {/* User dashboard without sidebar */}
        <Route path="/user/dashboard" element={<UserDashboard />} />

        {/* User-related pages with sidebar (except profile) */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route element={<UserLayout links={userLinks} position="left" />}>
          <Route path="/update-password" element={<UpdateUserPassword onClose={() => {}} />} />
        </Route>
      </Routes>
    </Suspense>
  );
}