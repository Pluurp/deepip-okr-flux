
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
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
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Log In
          </Button>
          <Button size="sm" className="bg-deepip-primary text-white hover:bg-deepip-primary/90">
            Request Trial
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
