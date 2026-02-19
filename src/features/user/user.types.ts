export type Role = "USER" | "AGENT" | "ADMIN" | "VISITOR" | "MANAGER" | string;


export interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  profileImage: string | null;
}

export interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  activeRole: Role | null;
  setActiveRole: (role: Role | null) => void;
}