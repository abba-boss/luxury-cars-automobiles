import { Search, Bell, User, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PremiumHeaderProps {
  title?: string;
  subtitle?: string;
}

export function PremiumHeader({ title, subtitle }: PremiumHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-800 bg-gradient-to-b from-gray-900 to-black/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hidden lg:block">
              Sarkin Mota Autos
            </h1>
          </div>
        </div>

        {/* Page Title (Mobile) or Search (Desktop) */}
        <div className="flex-1 lg:max-w-md">
          <div className="hidden lg:block relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search cars, brands, models..."
              className="pl-11 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          {title && (
            <div className="lg:hidden pl-12">
              <h1 className="font-semibold text-white">{title}</h1>
              {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-gray-800/50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-gray-800/50">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full border-gray-700 text-white hover:bg-gray-800/50 hover:border-red-500">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search cars, brands, models..."
              className="pl-11 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>
      )}
    </header>
  );
}