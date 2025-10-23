import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Building2, GraduationCap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">KADA Connect</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Korea-ASEAN Digital Academy
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button
            variant={isActive("/companies") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/company">
              <Building2 className="mr-2 h-4 w-4" />
              Companies
            </Link>
          </Button>

          <Button
            variant={isActive("/trainees") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/trainees">
              <GraduationCap className="mr-2 h-4 w-4" />
              Trainees
            </Link>
          </Button>

          {isLoggedIn ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile/company">My Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="flex flex-col gap-2 p-4">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>

            <Button
              variant={isActive("/companies") ? "default" : "ghost"}
              size="sm"
              asChild
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/companies">
                <Building2 className="mr-2 h-4 w-4" /> Companies
              </Link>
            </Button>

            <Button
              variant={isActive("/trainees") ? "default" : "ghost"}
              size="sm"
              asChild
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/trainees">
                <GraduationCap className="mr-2 h-4 w-4" /> Trainees
              </Link>
            </Button>

            {isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/profile/company">My Profile</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
