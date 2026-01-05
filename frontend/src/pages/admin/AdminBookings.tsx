import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Car,
  Check,
  X,
  Search,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { bookingService } from '@/services';
import { LoadingSpinner } from '@/components/ui/loading';

interface Booking {
  id: number;
  user: {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
  };
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    images: string[];
  };
  booking_date: string;
  booking_time: string;
  type: 'test_drive' | 'inspection' | 'consultation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await bookingService.getAllBookings(params);
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const customerName = booking.user?.full_name || '';
    const carName = `${booking.vehicle?.make} ${booking.vehicle?.model}` || '';
    const matchesSearch = 
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: number, status: Booking['status']) => {
    try {
      const response = await bookingService.updateBookingStatus(id, { status });
      if (response.success) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
        toast.success(`Booking ${status} successfully`);
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Test Drive Bookings</h2>
            <p className="text-muted-foreground">Manage test drive appointments</p>
          </div>
          <Button className="gap-2 rounded-xl" onClick={fetchBookings}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-amber-400">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-blue-400">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-card border border-border p-5 hover:border-primary/30 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className={cn('capitalize', getStatusColor(booking.status))}>
                      {booking.status}
                    </Badge>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{booking.user?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">{booking.user?.email || 'No email'}</p>
                    </div>
                  </div>

                  {/* Car Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 flex items-center justify-center">
                      <Car className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {booking.vehicle?.make} {booking.vehicle?.model} {booking.vehicle?.year}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{booking.type?.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{booking.booking_time}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="p-3 rounded-lg bg-muted/50 border border-border/50 mb-4">
                      <p className="text-sm text-muted-foreground">Notes:</p>
                      <p className="text-sm text-foreground mt-1">{booking.notes}</p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4">
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="flex-1"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateStatus(booking.id, 'completed')}
                        className="w-full"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
                <p className="text-muted-foreground">There are no bookings matching your filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
