import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { bookingService } from '@/services';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  vehicleId: number;
  vehicleName: string;
  onBookingCreated?: () => void;
}

export function BookingForm({ vehicleId, vehicleName, onBookingCreated }: BookingFormProps) {
  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '',
    type: 'test_drive' as 'test_drive' | 'inspection' | 'consultation',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.booking_date || !formData.booking_time) {
      toast({
        title: "Missing information",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await bookingService.createBooking({
        vehicle_id: vehicleId,
        ...formData
      });

      toast({
        title: "Booking created",
        description: "Your booking request has been submitted successfully!"
      });

      setFormData({
        booking_date: '',
        booking_time: '',
        type: 'test_drive',
        notes: ''
      });

      onBookingCreated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book a {formData.type.replace('_', ' ')} for {vehicleName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="booking_date">Date</Label>
              <Input
                id="booking_date"
                type="date"
                min={today}
                value={formData.booking_date}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="booking_time">Time</Label>
              <Input
                id="booking_time"
                type="time"
                value={formData.booking_time}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Booking Type</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test_drive">Test Drive</SelectItem>
                <SelectItem value="inspection">Vehicle Inspection</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific requirements or questions..."
              rows={3}
              maxLength={500}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Clock className="h-4 w-4 mr-2" />
            {loading ? 'Creating Booking...' : 'Book Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
