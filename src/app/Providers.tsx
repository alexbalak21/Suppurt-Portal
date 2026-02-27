import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@features/auth";
import { UserProvider } from "@features/user";
import { UsersProvider } from "@features/user/UsersContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutes default — overridden per-query
      gcTime: 1000 * 60 * 30,     // 30 minutes in memory after unmount
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export { queryClient };

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <UserProvider>
            <UsersProvider>
              {children}
            </UsersProvider>
          </UserProvider>
        </AuthProvider>
      </Router>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}