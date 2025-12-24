import { useState } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToFavorites = async (carId: string) => {
    setFavorites(prev => [...prev, carId]);
    return { error: null };
  };

  const removeFromFavorites = async (carId: string) => {
    setFavorites(prev => prev.filter(id => id !== carId));
    return { error: null };
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
};
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setFavorites(data?.map(f => f.car_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (carId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, car_id: carId });
      
      if (error) throw error;
      
      setFavorites(prev => [...prev, carId]);
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
      return false;
    }
  };

  const removeFavorite = async (carId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);
      
      if (error) throw error;
      
      setFavorites(prev => prev.filter(id => id !== carId));
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  const toggleFavorite = async (carId: string) => {
    if (favorites.includes(carId)) {
      return removeFavorite(carId);
    } else {
      return addFavorite(carId);
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
