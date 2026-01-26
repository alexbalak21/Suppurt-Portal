import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../features/auth";
import { UserProvider } from "../features/user";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}