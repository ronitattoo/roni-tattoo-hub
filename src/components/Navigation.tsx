import { Link, useLocation } from "react-router-dom";
import { Home, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Αποσύνδεση επιτυχής",
      description: "Τα λέμε σύντομα!",
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border" aria-label="Main navigation">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent" aria-label="Roni Tattoo Artist Home">
          Roni Tattoo
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="View portfolio">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Portfolio</span>
            </Button>
          </Link>
          
          <Link to="/about" aria-label="About Roni Tattoo Artist">
            <Button
              variant={location.pathname === "/about" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">About</span>
            </Button>
          </Link>

          {user ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Αποσύνδεση</span>
            </Button>
          ) : (
            <Link to="/auth" aria-label="Login">
              <Button
                variant={location.pathname === "/auth" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Σύνδεση</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
