import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-6">
              <img 
                src="/logo.png" 
                alt="Perfect Day Reset Logo" 
                className="h-14 md:h-16 inline-block bg-white rounded-xl p-2"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">Transform your daily routine and discover a more balanced, productive, and fulfilling life.</p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'How It Works', path: '/what-you-get' }, 
                { name: 'FAQs', path: '#faq' }
              ].map((item, i) => (
                <li key={i}>
                  <a 
                    href={item.path} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Product Pages</h4>
            <ul className="space-y-3">
              {[
                { name: 'Welcome & Prep', path: '/product/reset/welcome' },
                { name: 'Morning Routine', path: '/product/reset/morning' },
                { name: 'Midday Recharge', path: '/product/reset/midday' },
                { name: 'Evening Wind Down', path: '/product/reset/evening' },
                { name: 'Final Reflection', path: '/product/reset/reflection' }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.path}>
                    <span className="text-gray-300 hover:text-white transition-colors duration-300 block cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy">
                  <span className="text-gray-300 hover:text-white transition-colors duration-300 block cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <span className="text-gray-300 hover:text-white transition-colors duration-300 block cursor-pointer">
                    Terms of Service
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy">
                  <span className="text-gray-300 hover:text-white transition-colors duration-300 block cursor-pointer">
                    Cookie Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy">
                  <span className="text-gray-300 hover:text-white transition-colors duration-300 block cursor-pointer">
                    Refund Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Perfect Day Reset. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
