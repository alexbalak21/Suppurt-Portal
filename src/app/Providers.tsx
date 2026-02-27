import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@features/auth";
import { UserProvider } from "@features/user";
import { UsersProvider } from "@features/user/UsersContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <UsersProvider>
            {children}
          </UsersProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}