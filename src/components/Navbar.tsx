
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Settings,
  Building2,
  Home,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavItems = () => (
    <>
      <Link to="/" onClick={closeMenu}>
        <Button
          variant={isActive("/") ? "default" : "ghost"}
          className="w-full justify-start"
          size={isMobile ? "default" : "sm"}
        >
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </Link>
      <Link to="/company" onClick={closeMenu}>
        <Button
          variant={isActive("/company") ? "default" : "ghost"}
          className="w-full justify-start"
          size={isMobile ? "default" : "sm"}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Company
        </Button>
      </Link>
      <Link to="/timeline" onClick={closeMenu}>
        <Button
          variant={isActive("/timeline") ? "default" : "ghost"}
          className="w-full justify-start"
          size={isMobile ? "default" : "sm"}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Timeline
        </Button>
      </Link>
      <Link to="/settings" onClick={closeMenu}>
        <Button
          variant={isActive("/settings") ? "default" : "ghost"}
          className="w-full justify-start"
          size={isMobile ? "default" : "sm"}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </Link>
    </>
  );

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Logo />

        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="flex items-center ml-6 space-x-2">
            <NavItems />
          </nav>
        )}
      </div>

      {/* Mobile navigation */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 top-16 z-50 bg-white p-4 flex flex-col space-y-2 transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <NavItems />
        </div>
      )}
    </div>
  );
};

export default Navbar;
