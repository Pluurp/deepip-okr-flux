
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Settings, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border/40 bg-white shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          
          {isMobile ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu size={20} />
            </Button>
          ) : (
            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/departments/leadership"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Leadership
              </Link>
              <Link
                to="/departments/product"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Product
              </Link>
              <Link
                to="/departments/ai"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                AI & ML
              </Link>
              <Link
                to="/departments/sales"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Sales
              </Link>
              <Link
                to="/departments/growth"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Growth
              </Link>
              <Link
                to="/company"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Company
              </Link>
              <Link
                to="/settings"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground flex items-center gap-1"
              >
                <Settings size={14} />
                Settings
              </Link>
            </nav>
          )}
        </div>
        
        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-md py-4 px-6 md:hidden animate-slide-in z-50">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/departments/leadership"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Leadership
              </Link>
              <Link
                to="/departments/product"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Product
              </Link>
              <Link
                to="/departments/ai"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                AI & ML
              </Link>
              <Link
                to="/departments/sales"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sales
              </Link>
              <Link
                to="/departments/growth"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Growth
              </Link>
              <Link
                to="/company"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Company
              </Link>
              <Link
                to="/settings"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground flex items-center gap-1 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={14} />
                Settings
              </Link>
            </nav>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Log In
          </Button>
          <Button size="sm" className="bg-deepip-primary text-white hover:bg-deepip-primary/90 shadow-sm">
            Request Trial
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
