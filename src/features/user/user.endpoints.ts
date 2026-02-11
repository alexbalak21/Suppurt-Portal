export const USER_ENDPOINTS = {
  me: "/api/auth/me",
  profileImage: "/api/auth/me/profile-image",
  password: "/api/auth/me/password",
  list: "/api/users",
  userUpdate: "/api/users/me",
} as const;
