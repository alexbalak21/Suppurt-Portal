// import { useRole } from "../features/auth/useRole";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import ApiDemo from "../pages/ApiDemo";
import Register from "../pages/Register";
import Profile from "../pages/User/Profile";
import UpdateProfile from "../pages/User/UpdateProfile";
import UpdateUserPassword from "../pages/User/UpdateUserPassword";
import { UserLayout } from "../components";
import { UserIcon, PencilSquareIcon, KeyIcon } from "@heroicons/react/24/outline";

import EditorPage from "../pages/EditorPage";

const userLinks = [
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
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User-related pages with sidebar */}
      <Route element={<UserLayout links={userLinks} position="left" />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/update-password" element={<UpdateUserPassword />} />
      </Route>
    </Routes>
  );
}