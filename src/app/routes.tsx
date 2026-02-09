import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import ApiDemo from "../pages/ApiDemo";
import Register from "../pages/Register";
import Profile from "../pages/User/Profile";
import UpdateProfile from "../pages/User/UpdateProfile";
import UpdateUserPassword from "../pages/User/UpdateUserPassword";
import UserDashboard from "../pages/User/userDashboard";
import { UserLayout } from "../components";
import { UserIcon, PencilSquareIcon, KeyIcon, HomeIcon } from "@heroicons/react/24/outline";

import CreateTicketPage from "../pages/Ticket/CreateTicketPage";
import TicketListPage from "../pages/Ticket/TicketListPage";
import TicketDetailsPage from "../pages/Ticket/TicketDetailsPage";
import SupportDashboard from "../pages/Support/SupportDashboard";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";

const userLinks = [
  { name: "Dashboard", href: "/user/dashboard", icon: HomeIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
  { name: "Edit Profile", href: "/update-profile", icon: PencilSquareIcon },
  { name: "Update Password", href: "/update-password", icon: KeyIcon },
];

export function AppRoutes() {
  // You can add role-based logic here if needed, or keep this as the main route structure
  return (
    <Routes>
      {/* Normal pages without sidebar */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/demo" element={<ApiDemo />} />
      <Route path="/create-ticket" element={<CreateTicketPage />} />
      <Route path="/ticket-list" element={<TicketListPage />} />
      <Route path="/ticket/:id" element={<TicketDetailsPage />} />
      <Route path="/agent/tickets" element={<TicketListPage />} />
      <Route path="/support/dashboard" element={<SupportDashboard />} />
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User-related pages with sidebar */}
      {/* User dashboard without sidebar */}
      <Route path="/user/dashboard" element={<UserDashboard />} />

      {/* User-related pages with sidebar */}
      <Route element={<UserLayout links={userLinks} position="left" />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/update-password" element={<UpdateUserPassword />} />
      </Route>
    </Routes>
  );
}