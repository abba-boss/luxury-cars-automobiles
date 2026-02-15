import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, Search, Settings, LogOut, LayoutDashboard, Car, Users, Package, Heart, Mail } from "lucide-react";
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
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Navigation - Clean Top Nav Only */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm"
            : "bg-transparent py-6"
        )}
      >
        <nav className="max-w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">SM</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-foreground tracking-wide text-sm sm:text-base">SARKIN MOTA</p>
                <p className="text-[8px] sm:text-[10px] text-muted-foreground tracking-[0.15em] sm:tracking-[0.2em]">AUTOS</p>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative py-2",
                    location.pathname === link.href
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
                  )}
                  aria-current={location.pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-foreground/10"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              {/* Notifications */}
              <NotificationCenter />

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-foreground/10"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-primary text-primary-foreground text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
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
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 sm:w-48">
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
                <Link to="/auth" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-foreground/10 text-xs sm:text-sm"
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
                {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
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
            "lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-background/98 backdrop-blur-xl transition-all duration-500 z-40 overflow-y-auto",
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                  }
                }}
                tabIndex={isMobileMenuOpen ? 0 : -1}
                aria-current={location.pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}


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
        <div className="max-w-full mx-auto section-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground font-bold text-lg sm:text-xl">SM</span>
                </div>
                <div>
                  <p className="font-bold text-foreground text-base sm:text-lg tracking-wide">SARKIN MOTA</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.15em] sm:tracking-[0.2em]">AUTOS</p>
                </div>
              </Link>
              <p className="text-muted-foreground max-w-xs sm:max-w-md text-sm leading-relaxed">
                Your premier destination for premium automobiles.
                We curate exceptional vehicles for discerning clients who appreciate
                quality, elegance, and uncompromising excellence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-6 text-sm tracking-wider">QUICK LINKS</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-6 text-sm tracking-wider">CONTACT</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a
                    href="mailto:alaminsarkinmota@gmail.com"
                    className="hover:text-primary transition-colors cursor-pointer block flex items-center gap-2 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="truncate max-w-[120px] sm:max-w-[150px]">alaminsarkinmota@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sarkin Mota Automobiles. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
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
