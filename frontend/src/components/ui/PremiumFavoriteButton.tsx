import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { favoriteService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PremiumFavoriteButtonProps {
  vehicleId: number;
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export function PremiumFavoriteButton({ vehicleId, isFavorite = false, onToggle, className }: PremiumFavoriteButtonProps) {
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
      onToggle?.(!favorite);
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
        "h-10 w-10 rounded-full bg-black/30 backdrop-blur-md transition-all duration-500 hover:scale-110 hover:bg-red-600/30 hover:text-red-500 group-hover:opacity-100 opacity-0",
        favorite
          ? "bg-red-600/30 text-red-500 scale-110"
          : "",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-300",
          favorite ? "fill-current" : ""
        )}
      />
    </Button>
  );
}