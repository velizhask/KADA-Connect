import { Mail, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Top Section - Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              KADA Connect
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bridging talent and opportunity between Korea-ASEAN digital
              professionals and industry leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/companies"
                  className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  Companies
                </a>
              </li>
              <li>
                <a
                  href="/trainees"
                  className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  Trainees
                </a>
              </li>
              <li>
                <a
                  href="https://elice.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  About Elice
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left side */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© 2025 KADA Connect</span>
              <span className="hidden md:inline text-gray-300">•</span>
              <div className="flex items-center gap-1 text-gray-500">
                <span>Powered by</span>
                <img
                  src="/eliceCI.svg"
                  alt="Elice logo"
                  className="h-4 w-auto shrink-0"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
