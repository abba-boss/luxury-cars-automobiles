import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { favoriteService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  vehicleId: number;
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export function FavoriteButton({ vehicleId, isFavorite = false, onToggle, className }: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (favorite) {
        await favoriteService.removeFromFavorites(vehicleId);
        setFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Vehicle removed from your favorites"
        });
      } else {
        await favoriteService.addToFavorites(vehicleId);
        setFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Vehicle added to your favorites"
        });
      }
      onToggle?.(favorite);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "h-8 w-8 rounded-full transition-all duration-200",
        favorite 
          ? "bg-red-50 text-red-500 hover:bg-red-100" 
          : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all duration-200",
          favorite ? "fill-current" : ""
        )} 
      />
    </Button>
  );
}
