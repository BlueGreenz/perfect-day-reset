import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const forceWhitePages = ["/what-you-get", "/quiz", "/checkout", "/about", "/contact", "/guides"];
  const shouldForceWhite = forceWhitePages.includes(location) || location.startsWith("/guides/");

  useEffect(() => {
    if (shouldForceWhite) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldForceWhite]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`
          fixed w-full z-50 transition-all duration-300 bg-white
          ${scrolled || shouldForceWhite ? "shadow-md py-1 md:py-2" : "shadow-sm py-1 md:py-2"}
        `}
      >
        <div className="container px-3 md:px-6 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Perfect Day Reset Logo"
                  className="h-10 md:h-12 rounded-lg"
                  style={{
                    background: "white",
                    padding: "3px",
                    imageRendering: "crisp-edges",
                  }}
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-7">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold text-sm bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Free 60s Diagnostic
            </Link>

            <Link
              href="/guides"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Reset Guides
            </Link>
            <Link
              href="/what-you-get"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  setTimeout(() => {
                    document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
            >
              Testimonials
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                className="font-medium px-4 py-2 rounded-full transition-all hover:scale-105 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Login
              </Button>
            </Link>

            <Link href="/checkout">
              <Button className="font-medium px-6 py-2 rounded-full transition-all hover:scale-105 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                Start Now — $19
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/quiz">
              <Button
                variant="outline"
                size="sm"
                className="border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 h-8 px-2.5 text-xs font-semibold"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Free Quiz
              </Button>
            </Link>

            <Link href="/checkout">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10 h-8 px-2 text-xs font-medium"
              >
                $19
              </Button>
            </Link>

            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
              className="p-2 text-gray-700 rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 z-40 bg-white pt-20 px-4 transition-transform duration-300 transform md:hidden
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none invisible"}
        `}
      >
        <div className="flex flex-col space-y-5 py-6">
          <Link
            href="/quiz"
            className="text-orange-600 hover:text-orange-700 text-xl font-bold py-2.5 px-4 bg-orange-50 rounded-xl flex items-center justify-between border border-orange-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Free 60s Diagnostic
            </span>
            <ChevronRight className="h-5 w-5 text-orange-500" />
          </Link>

          <Link
            href="/guides"
            className="text-gray-900 hover:text-primary text-xl font-medium py-2 flex items-center justify-between border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Reset Guides
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            href="/about"
            className="text-gray-900 hover:text-primary text-xl font-medium py-2 flex items-center justify-between border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            href="/what-you-get"
            className="text-gray-900 hover:text-primary text-xl font-medium py-2 flex items-center justify-between border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            href="/"
            className="text-gray-900 hover:text-primary text-xl font-medium py-2 flex items-center justify-between border-b border-gray-100"
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (window.location.pathname === "/") {
                e.preventDefault();
                document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" });
              } else {
                setTimeout(() => {
                  document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            }}
          >
            Testimonials
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            href="/contact"
            className="text-gray-900 hover:text-primary text-xl font-medium py-2 flex items-center justify-between border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          <div className="pt-4">
            <Link
              href="/login"
              className="w-full block mb-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 font-medium py-3 rounded-full transition-all"
              >
                Login
              </Button>
            </Link>

            <Link
              href="/checkout"
              className="w-full block mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="cta-button bg-primary text-white font-medium py-3 rounded-full hover:bg-green-600 transition-all w-full">
                Start My 24-Hour Reset – $19
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
