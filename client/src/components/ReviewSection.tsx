import { useState, useEffect } from "react";
import { Star, User, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReviewForm } from "@/components/ReviewForm";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

interface ReviewSectionProps {
  hotelId: number;
  hotelName: string;
}

export function ReviewSection({ hotelId, hotelName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}/reviews`);
      const data = await response.json();
      setReviews(data);
      
      // Calculate average rating
      if (data.length > 0) {
        const avg = data.reduce((sum: number, review: Review) => sum + review.rating, 0) / data.length;
        setAverageRating(Number(avg.toFixed(1)));
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const renderStars = (rating: number, className?: string) => {
    return (
      <div className={`flex gap-1 ${className}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const onReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchReviews(); // Refresh reviews
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">Guest Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="font-medium">{averageRating}</span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
          )}
        </div>
        
        {user && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          hotelId={hotelId}
          hotelName={hotelName}
          onClose={() => setShowReviewForm(false)}
          onSubmitted={onReviewSubmitted}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {review.user.firstName && review.user.lastName 
                            ? `${review.user.firstName} ${review.user.lastName}`
                            : review.user.email.split('@')[0]
                          }
                        </span>
                        {renderStars(review.rating)}
                        <Badge variant="outline">
                          {review.rating}/5
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    
                    {review.title && (
                      <h4 className="font-medium text-gray-900">{review.title}</h4>
                    )}
                    
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}