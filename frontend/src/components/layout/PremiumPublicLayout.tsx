import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, Search, Settings, LogOut, Phone, MessageCircle, LayoutDashboard, Car, Users, MessageSquare as MessageSquareLucide, Package, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PremiumHeader } from "@/components/layout/PremiumHeader";
import { PremiumFooter } from "@/components/layout/PremiumFooter";

interface PremiumPublicLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/cars" },
  { label: "Valuation", href: "/valuation" },
  { label: "Financing", href: "/financing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function PremiumPublicLayout({ children }: PremiumPublicLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, getItemCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      {/* Premium Navigation */}
      <PremiumHeader title="" subtitle="" />
      
      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 top-[72px] bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl transition-all duration-500 z-40",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "block text-2xl font-semibold transition-all duration-300 transform",
                location.pathname === link.href
                  ? "text-white font-bold"
                  : "text-gray-300",
                isMobileMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Contact */}
          <div className="pt-6 border-t border-gray-800 space-y-4">
            <div className="flex gap-3">
              <a
                href="tel:+2347015136111"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-700 rounded-lg hover:border-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Phone className="h-5 w-5 text-red-500" />
                <span>Call</span>
              </a>
              <a
                href="https://wa.me/2347015136111"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-700 rounded-lg hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Account Section */}
          <div className="pt-4 space-y-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-lg text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/saved"
                  className="block text-lg text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Saved Cars
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-lg text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-lg text-gray-400 hover:text-white transition-colors w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block text-lg text-red-500 hover:text-red-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>

      {/* Premium Footer */}
      <PremiumFooter />
    </div>
  );
}