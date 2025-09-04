import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Star, Users, Wifi, Car, Utensils, Waves } from "lucide-react";
import { format } from "date-fns";
import { BookingModal } from "@/components/BookingModal";
import { ReviewSection } from "@/components/ReviewSection";

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
  partnerId: number;
  isActive: boolean;
  createdAt: string;
}

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

export function HotelSearch() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (amenityLower.includes('pool') || amenityLower.includes('beach')) return <Waves className="h-4 w-4" />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('bar')) return <Utensils className="h-4 w-4" />;
    if (amenityLower.includes('parking')) return <Car className="h-4 w-4" />;
    return null;
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hotels");
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async (hotelId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hotels/${hotelId}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    fetchRooms(hotel.id);
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 z-50">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Stay</h1>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Where</label>
              <Input
                placeholder="Search by city or hotel name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Check in</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start text-left font-normal"
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Check out</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start text-left font-normal"
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button className="h-12 bg-teal-500 hover:bg-teal-600 text-white self-end">
              Search
            </Button>
          </div>
        </Card>
      </div>

      {!selectedHotel ? (
        /* Hotels List */
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Available Hotels</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 animate-pulse mb-4"></div>
                    <div className="h-8 bg-gray-200 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ 
                      backgroundImage: hotel.images[0] ? `url(${hotel.images[0]})` : 'url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa)'
                    }}
                  ></div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{hotel.name}</h3>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {hotel.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{hotel.city}, {hotel.state}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {hotel.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hotel.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleHotelSelect(hotel)}
                      className="w-full bg-teal-500 hover:bg-teal-600"
                    >
                      View Rooms
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Hotel Details & Rooms */
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedHotel(null)}
            >
              ← Back to Hotels
            </Button>
            <h2 className="text-2xl font-semibold">{selectedHotel.name}</h2>
          </div>

          {/* Hotel Info */}
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                className="h-64 bg-cover bg-center rounded-lg"
                style={{ 
                  backgroundImage: selectedHotel.images[0] ? `url(${selectedHotel.images[0]})` : 'url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa)'
                }}
              ></div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {selectedHotel.rating}
                  </Badge>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedHotel.address}, {selectedHotel.city}, {selectedHotel.state}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{selectedHotel.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Reviews Section */}
          <ReviewSection hotelId={selectedHotel.id} hotelName={selectedHotel.name} />

          {/* Rooms */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Available Rooms</h3>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 animate-pulse mb-4"></div>
                    <div className="h-8 bg-gray-200 animate-pulse"></div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map((room) => (
                  <Card key={room.id} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div 
                        className="h-32 bg-cover bg-center rounded"
                        style={{ 
                          backgroundImage: room.images[0] ? `url(${room.images[0]})` : 'url(https://images.unsplash.com/photo-1595576508898-0ad5c879a061)'
                        }}
                      ></div>
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-lg mb-2">{room.type}</h4>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">Up to {room.capacity} guests</span>
                          </div>
                          <span className="text-sm text-gray-600">Room {room.roomNumber}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{room.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="text-right">
                          <div className="text-2xl font-bold">${room.pricePerNight}</div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                        <Button 
                          className="bg-teal-500 hover:bg-teal-600 mt-4"
                          onClick={() => {
                            setSelectedRoom(room);
                            setIsBookingModalOpen(true);
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        hotel={selectedHotel}
        initialCheckIn={checkInDate}
        initialCheckOut={checkOutDate}
      />
    </div>
  );
}