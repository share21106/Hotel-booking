import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: number;
  hotelId: number;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  hotel: {
    name: string;
  };
}

interface ReviewFormProps {
  hotelId: number;
  hotelName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export function ReviewForm({ hotelId, hotelName, onClose, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [selectedBooking, setSelectedBooking] = useState("");
  const [eligibleBookings, setEligibleBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEligibleBookings();
  }, [hotelId]);

  const fetchEligibleBookings = async () => {
    try {
      const response = await fetch("/api/bookings/my-bookings");
      const allBookings = await response.json();
      
      // Filter for completed bookings at this hotel
      const eligible = allBookings.filter((booking: Booking) => 
        booking.hotelId === hotelId && booking.status === 'completed'
      );
      
      setEligibleBookings(eligible);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoverRating(starRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBooking) {
      toast({
        title: "Please select a booking",
        description: "You can only review stays you've completed.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Rating is required to submit your review.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: selectedBooking,
          hotelId,
          rating,
          title: title.trim() || null,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience.",
      });

      onSubmitted();
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review for {hotelName}</DialogTitle>
        </DialogHeader>

        {eligibleBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              You can only review hotels where you've completed a stay.
            </p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select your stay</Label>
              <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose which stay to review" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleBookings.map((booking) => (
                    <SelectItem key={booking.id} value={booking.id.toString()}>
                      {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-2">
                {renderStars()}
                <span className="text-sm text-gray-600">
                  {rating > 0 && `${rating}/5`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Review Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your Review (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about your stay..."
                rows={4}
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500">
                {comment.length}/1000
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || rating === 0}
                className="flex-1 bg-teal-500 hover:bg-teal-600"
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}