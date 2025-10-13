import { Link, useLocation } from "react-router-dom";
import { Home, User, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          Roni Tattoo
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </Button>
          </Link>
          
          <Link to="/about">
            <Button
              variant={location.pathname === "/about" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
