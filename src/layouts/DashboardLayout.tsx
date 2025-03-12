
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-deepip-silver">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 animate-fade-in">
        {children}
      </main>
      <footer className="py-4 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-deepip-gray">
          <p>© {new Date().getFullYear()} DeepIP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
