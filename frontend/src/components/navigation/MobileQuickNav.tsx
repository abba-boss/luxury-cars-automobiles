import { useState, useEffect } from 'react';
import { Car, CreditCard, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const MobileQuickNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const hideThreshold = 100; // Hide after scrolling down 100px
  const hideOnPages = ['/cart', '/profile', '/dashboard', '/admin']; // Don't show on these pages

  // Handle scroll for hiding/showing
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't show on specific pages
  const shouldShow = !hideOnPages.includes(location.pathname) && 
                    typeof window !== 'undefined' && 
                    window.innerWidth <= 768; // Only show on mobile

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      href: '/', 
      active: location.pathname === '/' 
    },
    { 
      icon: Car, 
      label: 'Cars', 
      href: '/cars', 
      active: location.pathname.startsWith('/cars')
    },
    { 
      icon: CreditCard, 
      label: 'Financing', 
      href: '/financing', 
      active: location.pathname === '/financing'
    },
    { 
      icon: User, 
      label: 'Account', 
      href: '/profile', 
      active: ['/profile', '/dashboard', '/saved'].includes(location.pathname)
    },
  ];

  if (!shouldShow || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-30 md:hidden">
      <div className="flex items-center justify-around bg-card border border-border rounded-2xl p-2 shadow-lg backdrop-blur-xl">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant={item.active ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 flex-col h-14 gap-1 rounded-xl text-xs"
            onClick={() => {
              window.location.href = item.href;
            }}
          >
            <div className="relative">
              <item.icon className={`h-4 w-4 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`${item.active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileQuickNav;