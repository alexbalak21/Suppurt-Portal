export const USER_ENDPOINTS = {
  me: "/api/auth/me",
  profileImage: "/api/auth/me/profile-image",
  password: "/api/users/me/password",
  list: "/api/users",
  userUpdate: "/api/users/me",
} as const;
