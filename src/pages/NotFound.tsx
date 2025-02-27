
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";

const NotFound = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl font-bold text-deepip-primary mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center px-6 py-3"
        >
          Return to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default NotFound;
