import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Building2, GraduationCap, Home, User, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  // ✅ Auto close on scroll or click outside
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      {/* 🔹 Navbar Utama */}
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 text-white shadow-sm group-hover:shadow-md transition-shadow">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-900">KADA Connect</span>
            <span className="text-[10px] text-gray-500 hidden sm:block -mt-0.5">
              Korea-ASEAN Digital Academy
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/")
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Home
          </Link>

          <Link
            to="/companies"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/companies")
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Companies
          </Link>

          <Link
            to="/trainees"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/trainees")
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Trainees
          </Link>

          <div className="ml-2 pl-2 border-l border-gray-200">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile/company"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* 🔹 Mobile Nav muncul di bawah navbar */}
      {isMenuOpen && (
        <div className="relative" ref={menuRef}>
          {/* Overlay background */}
        

          {/* Slide-in Menu */}
          <div className="md:hidden fixed top-16 right-0 w-72 h-screen bg-white shadow-xl z-10 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full p-5 overflow-y-auto">
              {/* Links */}
              <div className="flex flex-col gap-2 mb-6">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive("/")
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>

                <Link
                  to="/companies"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive("/companies")
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Companies
                </Link>

                <Link
                  to="/trainees"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive("/trainees")
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  Trainees
                </Link>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile/company"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
