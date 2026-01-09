import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, Search, Settings, LogOut, Phone, MessageCircle, LayoutDashboard, Car, Users, MessageSquare as MessageSquareLucide, Package, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import MobileQuickNav from "@/components/navigation/MobileQuickNav";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/cars" },
  { label: "Valuation", href: "/valuation" },
  { label: "Financing", href: "/financing" },
  // { label: "Our Team", href: "/vendors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function PublicLayout({ children }: PublicLayoutProps) {
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
    <div className="min-h-screen bg-background">
      {/* Navigation - Clean Top Nav Only */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm"
            : "bg-transparent py-6"
        )}
      >
        <nav className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <span className="text-primary-foreground font-bold text-lg">SM</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-foreground tracking-wide">SARKIN MOTA</p>
                <p className="text-[10px] text-muted-foreground tracking-[0.2em]">AUTOS</p>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative py-2",
                    location.pathname === link.href
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Contact Buttons - Desktop Only */}
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary"
                  asChild
                >
                  <a href="tel:+2347015136111" aria-label="Call us">
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary"
                  asChild
                >
                  <a href="https://wa.me/2347015136111" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-foreground/10"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <NotificationCenter />

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-foreground/10"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {getItemCount()}
                    </span>
                  )}
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-foreground/10"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isAdmin ? (
                      // Admin menu
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin/cars')}>
                          <Car className="mr-2 h-4 w-4" />
                          Car Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                          <Users className="mr-2 h-4 w-4" />
                          User Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/messages')}>
                          <MessageSquareLucide className="mr-2 h-4 w-4" />
                          Messages
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                      </>
                    ) : (
                      // User menu
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/orders')}>
                          <Package className="mr-2 h-4 w-4" />
                          My Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/saved')}>
                          <Heart className="mr-2 h-4 w-4" />
                          Saved Cars
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/messages')}>
                          <MessageSquareLucide className="mr-2 h-4 w-4" />
                          Messages
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="hidden md:block">
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-foreground/10"
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full hover:bg-foreground/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search Bar - Expandable */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              isSearchOpen ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0"
            )}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cars, brands, models..."
                className="pl-11 bg-secondary/50 border-border/50 h-12"
                autoFocus={isSearchOpen}
              />
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-xl transition-all duration-500 z-40",
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
                    ? "text-primary font-bold"
                    : "text-foreground",
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
            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex gap-3">
                <a
                  href="tel:+2347015136111"
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:border-primary hover:bg-primary/10 transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/2347015136111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors"
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
                    className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/saved"
                    className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Saved Cars
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
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
                    className="block text-lg text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block text-lg text-primary hover:text-primary/80 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer - Minimal Tesla Style */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-[1800px] mx-auto section-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground font-bold text-xl">SM</span>
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg tracking-wide">SARKIN MOTA</p>
                  <p className="text-xs text-muted-foreground tracking-[0.2em]">AUTOS</p>
                </div>
              </Link>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Your premier destination for luxury and performance automobiles.
                We curate exceptional vehicles for discerning clients who appreciate
                quality, elegance, and uncompromising excellence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-6 text-sm tracking-wider">QUICK LINKS</h4>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-6 text-sm tracking-wider">CONTACT</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li>3F3G+74Q, Olusegun Obasanjo Way, beside NNPC Mega Gas Station, Central Business District, Abuja 900103, FCT, Nigeria</li>
                <li>
                  <a
                    href="tel:+2347015136111"
                    className="hover:text-primary transition-colors cursor-pointer block flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    +234 701 513 6111
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:alaminsarkinmota@gmail.com"
                    className="hover:text-primary transition-colors cursor-pointer block flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    alaminsarkinmota@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sarkin Mota Automobiles. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Quick Navigation */}
      <MobileQuickNav />
    </div>
  );
}
