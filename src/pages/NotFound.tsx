import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Update page title for SEO
    document.title = "404 - Page Not Found | Roni Tattoo Artist";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="text-center max-w-2xl" role="main">
        <h1 className="mb-4 text-6xl md:text-8xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all glow-effect"
          aria-label="Return to Roni Tattoo Artist homepage"
        >
          <Home className="w-5 h-5" aria-hidden="true" />
          Return to Home
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
