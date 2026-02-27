import { Link } from "react-router-dom";
import { useAuth } from "@features/auth";
import { useRole } from "@features/auth/useRole";

export default function Home() {
  const { accessToken } = useAuth();
  const { isManager, isSupport, isUser } = useRole();

  const dashboardLink = isManager
    ? "/manager/dashboard"
    : isSupport
      ? "/support/dashboard"
      : isUser
        ? "/user/dashboard"
        : null;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-12 px-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
        Support Portal
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Track, manage, and resolve issues efficiently.
      </p>

      <div className="flex gap-4">
        {accessToken && dashboardLink ? (
          <Link
            to={dashboardLink}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
            
          </>
        )}
      </div>
    </div>
  );
}
