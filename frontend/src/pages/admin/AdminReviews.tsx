import { useState } from 'react';
import {
  Star,
  Search,
  MoreVertical,
  Check,
  X,
  Eye,
  Flag,
  Trash2,
  ThumbsUp,
  MessageSquare,
  Filter,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Review {
  id: string;
  author: string;
  email: string;
  rating: number;
  title: string;
  content: string;
  carName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  helpful: number;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'John Doe',
    email: 'john@email.com',
    rating: 5,
    title: 'Excellent service!',
    content: 'The team at luxury car was incredibly professional. The car was exactly as described and the buying process was smooth.',
    // Replaced "Sarkin Mota" brand name with generic term
    carName: '2024 Mercedes-Benz S-Class',
    status: 'approved',
    createdAt: '2024-05-10',
    helpful: 24,
    verified: true,
  },
  {
    id: '2',
    author: 'Sarah Williams',
    email: 'sarah@email.com',
    rating: 4,
    title: 'Great experience overall',
    content: 'Very satisfied with my purchase. The only reason for 4 stars is the delivery took a bit longer than expected.',
    carName: '2023 BMW X7',
    status: 'pending',
    createdAt: '2024-05-12',
    helpful: 8,
    verified: true,
  },
  {
    id: '3',
    author: 'Anonymous',
    email: 'anon@email.com',
    rating: 2,
    title: 'Disappointed with the condition',
    content: 'The car had some minor issues that were not mentioned in the listing. Communication could have been better.',
    carName: '2022 Toyota Land Cruiser',
    status: 'pending',
    createdAt: '2024-05-14',
    helpful: 2,
    verified: false,
  },
  {
    id: '4',
    author: 'Michael Chen',
    email: 'michael@email.com',
    rating: 5,
    title: 'Best car buying experience!',
    content: 'From start to finish, everything was perfect. The 360° view feature on the website helped me make my decision.',
    carName: '2024 Range Rover Sport',
    status: 'approved',
    createdAt: '2024-05-08',
    helpful: 45,
    verified: true,
  },
];

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.carName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const updateStatus = (id: string, status: Review['status']) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Review ${status}`);
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
    toast.success('Review deleted');
  };

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Reviews Management</h2>
            <p className="text-muted-foreground">Moderate and manage customer reviews</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground">{averageRating}</p>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-400">{reviews.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-emerald-400">{reviews.filter(r => r.status === 'approved').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">5-Star Reviews</p>
            <p className="text-2xl font-bold text-primary">{reviews.filter(r => r.rating === 5).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review, idx) => (
            <div
              key={review.id}
              className="rounded-2xl bg-card border border-border p-6 hover:border-primary/30 transition-all animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Author Info */}
                <div className="flex items-start gap-3 lg:w-48 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {review.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{review.author}</p>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(review.rating)}
                    <Badge variant="outline" className={cn('capitalize', getStatusColor(review.status))}>
                      {review.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{review.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {review.carName}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {review.helpful} helpful
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-shrink-0">
                  {review.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="rounded-lg gap-1"
                        onClick={() => updateStatus(review.id, 'approved')}
                      >
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => updateStatus(review.id, 'rejected')}
                      >
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" /> View Full
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" /> Flag Review
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No reviews found</h3>
            <p className="text-muted-foreground">There are no reviews matching your filters</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
