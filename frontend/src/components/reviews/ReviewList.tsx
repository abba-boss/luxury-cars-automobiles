import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { reviewService } from '@/services';
import { cn } from '@/lib/utils';
import type { Review as ReviewType } from '@/types/api';

interface ReviewListProps {
  vehicleId: number;
  refreshTrigger?: number;
}

export function ReviewList({ vehicleId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getVehicleReviews(vehicleId);
      if (response.success && response.data) {
        setReviews(response.data);

        // Calculate average rating
        if (response.data.length > 0) {
          const avg = response.data.reduce((sum: number, review: ReviewType) => sum + review.rating, 0) / response.data.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vehicleId, refreshTrigger]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{averageRating}</div>
                <div className="text-sm text-gray-500">out of 5</div>
              </div>
              <div>
                {renderStars(Math.round(averageRating))}
                <div className="text-sm text-gray-500 mt-1">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No reviews yet. Be the first to review this vehicle!
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.user.full_name}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                    {review.comment && (
                      <p className="mt-3 text-gray-700">{review.comment}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
