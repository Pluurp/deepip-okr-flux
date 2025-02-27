
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} DeepIP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
