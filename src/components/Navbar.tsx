import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { X, Menu, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mobileMenuItems = [
    { title: "Home", path: "/" },
    { title: "Product", path: "/product", hasSubmenu: true },
    { title: "Security", path: "/security" },
    { title: "Why Us", path: "/why-us" },
    { title: "Resources", path: "/resources", hasSubmenu: true },
    { title: "Contact Us", path: "/contact" },
  ];

  return (
    <header className={cn(
      "border-b border-border/40 bg-white shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50",
      isMobile && isMenuOpen && "bg-[#1A1F2C] border-none"
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo className={cn(isMobile && isMenuOpen && "filter brightness-0 invert")} />
          </Link>
        </div>

        {isMobile ? (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn("md:hidden", isMenuOpen && "text-white")}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-[#1A1F2C] p-6 animate-fade-in z-40">
                <nav className="flex flex-col space-y-6">
                  {mobileMenuItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.path}
                      className="text-xl text-white/90 font-normal flex items-center justify-between"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                      {item.hasSubmenu && <ChevronDown size={20} />}
                    </Link>
                  ))}
                </nav>
                <div className="fixed bottom-8 left-6 right-6 space-y-4">
                  <Button 
                    className="w-full bg-deepip-primary hover:bg-deepip-primary/90 text-white rounded-xl py-6 text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Request Your Trial
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent text-white border-white/20 hover:bg-white/10 rounded-xl py-6 text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Button>
                </div>
              </div>
            )}
          </>
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

        {!isMobile && (
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              Log In
            </Button>
            <Button size="sm" className="bg-deepip-primary text-white hover:bg-deepip-primary/90 shadow-sm">
              Request Trial
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
