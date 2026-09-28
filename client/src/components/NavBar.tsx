import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight } from "lucide-react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Force white navbar for specific pages like what-you-get
  const forceWhitePages = ['/what-you-get'];
  const shouldForceWhite = forceWhitePages.includes(location);

  useEffect(() => {
    // If we're on a page that should force white navbar, set scrolled to always true
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

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [shouldForceWhite]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Journey", href: "#journey" },
    { label: "Program", href: "#program" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <>
      <nav 
        className={`
          fixed w-full z-50 transition-all duration-300
          ${scrolled || shouldForceWhite ? 'bg-white shadow-md py-1 md:py-2' : 'bg-white py-1 md:py-2'}
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
                    imageRendering: "crisp-edges"
                  }}
                />
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className={`hover:text-primary transition-colors ${
              scrolled || shouldForceWhite ? 'text-gray-700' : 'text-white'
            }`}>
              About
            </Link>
            <Link href="/what-you-get" className={`hover:text-primary transition-colors ${
              scrolled || shouldForceWhite ? 'text-gray-700' : 'text-white'
            }`}>
              How It Works
            </Link>
            <Link href="/" className={`hover:text-primary transition-colors ${
              scrolled || shouldForceWhite ? 'text-gray-700' : 'text-white'
            }`} onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                setTimeout(() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}>
              Testimonials
            </Link>
            <Link href="/contact" className={`hover:text-primary transition-colors ${
              scrolled || shouldForceWhite ? 'text-gray-700' : 'text-white'
            }`}>
              Contact
            </Link>
            
            <Link href="/login">
              <Button 
                variant="outline"
                className={`font-medium px-4 py-2 rounded-full transition-all hover:scale-105 ${
                  scrolled || shouldForceWhite 
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
              >
                Login
              </Button>
            </Link>
            
            <Link 
              href="/what-you-get"
            >
              <Button 
                className={`font-medium px-6 py-2 rounded-full transition-all hover:scale-105 ${
                  scrolled || shouldForceWhite 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30'
                }`}
              >
                Start Now
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link 
              href="/what-you-get"
              className="mr-3"
            >
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
              className="p-2 text-gray-700 rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={`
          fixed inset-0 z-40 bg-white pt-20 px-4 transition-transform duration-300 transform md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col space-y-6 py-8">
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
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                setTimeout(() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
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
          
          <div className="pt-6">
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
              href="/what-you-get"
              className="w-full block mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button 
                className="cta-button bg-primary text-white font-medium py-3 rounded-full hover:bg-green-600 transition-all w-full"
              >
                Get Started – $19
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
