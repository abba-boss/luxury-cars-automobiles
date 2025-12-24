import { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Car,
  MapPin,
  Phone,
  Mail,
  Check,
  X,
  MoreVertical,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
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

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carName: string;
  carId: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@email.com',
    customerPhone: '+234 801 234 5678',
    carName: '2024 Mercedes-Benz S-Class',
    carId: 'car-1',
    date: '2024-05-15',
    time: '10:00 AM',
    location: 'Lagos Showroom',
    status: 'pending',
    createdAt: '2024-05-10',
  },
  {
    id: '2',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@email.com',
    customerPhone: '+234 802 345 6789',
    carName: '2023 BMW X7',
    carId: 'car-2',
    date: '2024-05-16',
    time: '2:00 PM',
    location: 'Abuja Showroom',
    status: 'confirmed',
    notes: 'VIP customer, prepare coffee',
    createdAt: '2024-05-11',
  },
  {
    id: '3',
    customerName: 'Michael Chen',
    customerEmail: 'michael@email.com',
    customerPhone: '+234 803 456 7890',
    carName: '2024 Range Rover Sport',
    carId: 'car-3',
    date: '2024-05-14',
    time: '11:30 AM',
    location: 'Lagos Showroom',
    status: 'completed',
    createdAt: '2024-05-08',
  },
  {
    id: '4',
    customerName: 'Emma Johnson',
    customerEmail: 'emma@email.com',
    customerPhone: '+234 804 567 8901',
    carName: '2024 Porsche 911',
    carId: 'car-4',
    date: '2024-05-17',
    time: '4:00 PM',
    location: 'Lagos Showroom',
    status: 'cancelled',
    createdAt: '2024-05-12',
  },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.carName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: Booking['status']) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Booking ${status}`);
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
          <Button className="gap-2 rounded-xl">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-400">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-400">{bookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-blue-400">{bookings.filter(b => b.status === 'completed').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer or car..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl">
              <SelectValue placeholder="Status" />
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
          {filteredBookings.map((booking, idx) => (
            <div
              key={booking.id}
              className="rounded-2xl bg-card border border-border p-5 hover:border-primary/30 transition-all animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <Badge variant="outline" className={cn('capitalize', getStatusColor(booking.status))}>
                  {booking.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg -mt-1 -mr-1">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                      <Eye className="w-4 h-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    {booking.status === 'pending' && (
                      <DropdownMenuItem onClick={() => updateStatus(booking.id, 'confirmed')}>
                        <Check className="w-4 h-4 mr-2" /> Confirm
                      </DropdownMenuItem>
                    )}
                    {booking.status === 'confirmed' && (
                      <DropdownMenuItem onClick={() => updateStatus(booking.id, 'completed')}>
                        <Check className="w-4 h-4 mr-2" /> Mark Completed
                      </DropdownMenuItem>
                    )}
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <DropdownMenuItem 
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4 mr-2" /> Cancel
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{booking.customerName}</p>
                  <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                </div>
              </div>

              {/* Car */}
              <div className="flex items-center gap-2 text-sm text-foreground mb-3 p-3 rounded-xl bg-secondary/50">
                <Car className="w-4 h-4 text-primary" />
                {booking.carName}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {booking.date}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {booking.time}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {booking.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {booking.customerPhone}
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400">{booking.notes}</p>
                </div>
              )}

              {/* Actions */}
              {booking.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button 
                    className="flex-1 rounded-xl gap-2" 
                    size="sm"
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                  >
                    <Check className="w-4 h-4" /> Confirm
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10" 
                    size="sm"
                    onClick={() => updateStatus(booking.id, 'cancelled')}
                  >
                    <X className="w-4 h-4" /> Decline
                  </Button>
                </div>
              )}
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
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
