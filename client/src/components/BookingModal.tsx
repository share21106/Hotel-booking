import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Minus, Plus } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PaymentForm } from "@/components/PaymentForm";

interface Room {
  id: number;
  hotelId: number;
  roomNumber: string;
  type: string;
  capacity: number;
  pricePerNight: string;
  description: string;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: string;
}

interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  amenities: string[];
  images: string[];
  rating: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  hotel: Hotel | null;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  room, 
  hotel, 
  initialCheckIn, 
  initialCheckOut 
}: BookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(initialCheckOut);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitEmails, setSplitEmails] = useState<string[]>([""]);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const nights = checkInDate && checkOutDate ? 
    Math.max(1, differenceInDays(checkOutDate, checkInDate)) : 0;
  
  const subtotal = room ? parseFloat(room.pricePerNight) * nights : 0;
  const taxes = subtotal * 0.12; // 12% tax
  const total = subtotal + taxes;

  const handleAddEmail = () => {
    setSplitEmails([...splitEmails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    if (splitEmails.length > 1) {
      setSplitEmails(splitEmails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...splitEmails];
    newEmails[index] = value;
    setSplitEmails(newEmails);
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking",
        variant: "destructive",
      });
      return;
    }

    if (!room || !hotel || !checkInDate || !checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required booking details",
        variant: "destructive",
      });
      return;
    }

    if (guestCount > room.capacity) {
      toast({
        title: "Too Many Guests",
        description: `This room can only accommodate ${room.capacity} guests`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const splitPaymentData = isSplitPayment ? {
        participants: splitEmails
          .filter(email => email.trim())
          .map(email => ({
            email: email.trim(),
            amount: total / (splitEmails.filter(e => e.trim()).length + 1), // +1 for the booking user
            paid: false
          }))
      } : null;

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotelId: hotel.id,
          roomId: room.id,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          guestCount,
          specialRequests,
          isSplitPayment,
          splitPaymentData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      // Show payment form with client secret
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!room || !hotel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Your Stay</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {showPayment ? (
            /* Payment Section */
            <>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Complete Your Payment</h3>
                <p className="text-gray-600">
                  Secure payment for your stay at {hotel.name}
                </p>
              </div>
              
              <PaymentForm
                clientSecret={clientSecret}
                amount={Math.round(total * 100)} // Convert to cents
                onSuccess={() => {
                  toast({
                    title: "Payment Successful!",
                    description: `Your booking at ${hotel.name} has been confirmed.`,
                  });
                  onClose();
                }}
                onError={(error) => {
                  toast({
                    title: "Payment Failed",
                    description: error,
                    variant: "destructive",
                  });
                }}
              />
              
              <Button 
                variant="outline" 
                onClick={() => setShowPayment(false)}
                className="w-full"
              >
                ← Back to Booking Details
              </Button>
            </>
          ) : (
            <>
              {/* Hotel & Room Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div 
                  className="w-24 h-24 bg-cover bg-center rounded flex-shrink-0"
                  style={{ 
                    backgroundImage: room.images[0] ? `url(${room.images[0]})` : 'url(https://images.unsplash.com/photo-1595576508898-0ad5c879a061)'
                  }}
                ></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                  <p className="text-gray-600">{room.type} • Room {room.roomNumber}</p>
                  <p className="text-sm text-gray-500">{hotel.city}, {hotel.state}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Up to {room.capacity} guests</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${room.pricePerNight}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date <= (checkInDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                disabled={guestCount <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{guestCount}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuestCount(Math.min(room.capacity, guestCount + 1))}
                disabled={guestCount >= room.capacity}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 ml-2">
                (Max {room.capacity} guests)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests (Optional)</Label>
            <Textarea
              id="requests"
              placeholder="Any special requests or preferences..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          {/* Split Payment Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="split-payment"
                checked={isSplitPayment}
                onCheckedChange={setIsSplitPayment}
              />
              <Label htmlFor="split-payment">Split payment with others</Label>
            </div>

            {isSplitPayment && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <Label>Email addresses to split payment with:</Label>
                {splitEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveEmail(index)}
                      disabled={splitEmails.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEmail}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add another person
                </Button>
                {isSplitPayment && (
                  <div className="text-sm text-gray-600">
                    Total cost will be split between you and {splitEmails.filter(e => e.trim()).length} other{splitEmails.filter(e => e.trim()).length !== 1 ? 's' : ''}.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          {nights > 0 && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>${room.pricePerNight} x {nights} night{nights !== 1 ? 's' : ''}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & fees</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {isSplitPayment && splitEmails.filter(e => e.trim()).length > 0 && (
                  <div className="text-sm text-gray-600">
                    Your share: ${(total / (splitEmails.filter(e => e.trim()).length + 1)).toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Book Button */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={isLoading || !checkInDate || !checkOutDate || nights <= 0}
              className="flex-1 bg-teal-500 hover:bg-teal-600"
            >
              {isLoading ? "Booking..." : `Book Now - $${total.toFixed(2)}`}
            </Button>
          </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}