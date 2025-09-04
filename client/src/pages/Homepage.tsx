import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HotelSearch } from "@/components/HotelSearch";

export const Homepage = (): JSX.Element => {
  const howItWorksData = [
    {
      icon: "/figmaAssets/work1.png",
      title: "Create your profile",
      description:
        "Tell us about your travel dates, preferred destinations and the type of experience you're looking for",
    },
    {
      icon: "/figmaAssets/work2.png",
      title: "Browse & Match",
      description:
        "Discover premium hotels across Saudi Arabia and the wider region. Browse other verified travellers’ profiles and choose who you’d like to share with.",
    },
    {
      icon: "/figmaAssets/work3.png",
      title: "Book together",
      description:
        "Once you both agree, book your shared stay instantly. Payments are split automatically, and Costay handles all coordination.",
    },
    {
      icon: "/figmaAssets/work4.png",
      title: "Enjoy your stay",
      description:
        "Meet Meet your co‑traveller at the hotel, share new experiences and create lasting memories. After your trip, review each other to help future guests find their perfect match.",
    },
  ];

  const destinationData = [
    {
      image: "/figmaAssets/trend1.png",
      title: "Riyadh",
      counter: 120,
    },
    {
      image: "/figmaAssets/trend1.png",
      title: "Jeddah",
      counter: 120,

    },
    {
      image: "/figmaAssets/trend2.png",
      title: "Makkah",
      counter: 95,

    },
    {
      image: "/figmaAssets/trend1.png",
      title: "Madina",
      counter: 120,

    },
    {
      image: "/figmaAssets/trend2.png",
      title: "Abha",
      counter: 95,

    },
  ];

  const propertyData = [
    {
      image: "/figmaAssets/property1.jpg",
      title: "Modern Apartment in City Center",
      location: "Paris, France",
      price: "€85",
      rating: "4.8",
      reviews: "124",
    },
    {
      image: "/figmaAssets/property2.jpg",
      title: "Cozy Studio Near Beach",
      location: "Barcelona, Spain",
      price: "€65",
      rating: "4.9",
      reviews: "89",
    },
    {
      image: "/figmaAssets/property3.jpg",
      title: "Luxury Villa with Pool",
      location: "Santorini, Greece",
      price: "€150",
      rating: "4.7",
      reviews: "203",
    },
    {
      image: "/figmaAssets/property4.jpg",
      title: "Historic Loft Downtown",
      location: "London, UK",
      price: "£95",
      rating: "4.6",
      reviews: "156",
    },
    {
      image: "/figmaAssets/property5.jpg",
      title: "Penthouse with City Views",
      location: "New York, USA",
      price: "$120",
      rating: "4.8",
      reviews: "267",
    },
    {
      image: "/figmaAssets/property6.jpg",
      title: "Traditional Ryokan",
      location: "Tokyo, Japan",
      price: "¥8500",
      rating: "4.9",
      reviews: "98",
    },
  ];

  const featuresData = [
    {
      icon: "🔒",
      title: "AI Room",
      description:
        "Your payments are protected with bank-level security and encryption.",
    },
    {
      icon: "🌍",
      title: "Global Network",
      description: "Access thousands of verified accommodations worldwide.",
    },
    {
      icon: "📱",
      title: "Easy Communication",
      description:
        "Chat with your travel companions through our built-in messaging system.",
    },
    {
      icon: "⭐",
      title: "Verified Reviews",
      description:
        "Read honest reviews from real travelers who have stayed at each property.",
    },
    {
      icon: "🎯",
      title: "Smart Matching",
      description:
        "Our algorithm matches you with compatible travel companions.",
    },
    {
      icon: "💰",
      title: "Cost Splitting",
      description: "Automatically split costs fairly among all group members.",
    },
  ];

  const testimonialData = [
    {
      name: "Sarah Johnson",
      avatar: "/figmaAssets/avatar1.jpg",
      rating: 5,
      text: "Amazing experience! I saved 60% on my accommodation costs and met wonderful people.",
    },
    {
      name: "Mike Chen",
      avatar: "/figmaAssets/avatar2.jpg",
      rating: 5,
      text: "The platform is so easy to use. Found great travel companions for my Europe trip.",
    },
    {
      name: "Emma Wilson",
      avatar: "/figmaAssets/avatar3.jpg",
      rating: 5,
      text: "Coslay made my solo travel dreams affordable. Highly recommend to everyone!",
    },
  ];

  const footerLinks = {
    company: ["About Us", "Careers", "Press", "Blog", "Contact"],
    support: [
      "Help Center",
      "Safety",
      "Cancellation",
      "Community Guidelines",
      "Report Issue",
    ],
    hosting: [
      "List Your Space",
      "Host Resources",
      "Community Center",
      "Responsible Hosting",
    ],
    legal: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Sitemap"],
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Section */}
      <section
        className="relative min-h-[400px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/figmaAssets/background.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Find your stay, share the cost.
            </h1>
            <p className="text-xl opacity-90">
              Connect with fellow travelers and split accommodation costs
            </p>
          </div>
        </div>
      </section>

      {/* Hotel Search Section */}
      <section className="py-8">
        <HotelSearch />
      </section>

      {/* How Coslay Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Coslay Works</h2>
            <p className="text-gray-600">
              Join thousands of travelers enjoying shared hotel accommodations across Saudi Arabia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksData.map((item, index) => (
              <Card key={index} className="text-center border-0 shadow-none">
                <CardContent className="p-6">
                  <img
                      src={item.icon}
                      alt={item.title}
                      width={"64px"}
                      height={"64px"}
                      className="m-auto"
                    />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trending Destinations</h2>
            <p className="text-gray-600">
              Discover the most popular places to share and stay
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {destinationData.map((destination, index) => (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 relative">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex-col content-end p-2">
                      <h3 className="text-white font-semibold pb-1">
                        {destination.title}
                      </h3>
                      <h6 className="text-white text-1">
                        {destination.counter} Hotels
                      </h6>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Property Listings */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Accommodations</h2>
            <p className="text-gray-600">
              Hand-picked places perfect for sharing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {propertyData.map((property, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-200 relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {property.rating} ({property.reviews})
                      </Badge>
                      <span className="font-bold text-lg">
                        {property.price}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {property.location}
                    </p>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-auto py-2">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {propertyData.map((property, index) => (
              <Card
                key={`second-${index}`}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-200 relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {property.rating} ({property.reviews})
                      </Badge>
                      <span className="font-bold text-lg">
                        {property.price}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {property.location}
                    </p>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-auto py-2">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Events Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Top Events and weekend hotel stay
            </h2>
            <p className="text-gray-600">
              Perfect accommodations for special events and weekend getaways
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {propertyData.map((property, index) => (
              <Card
                key={`events-${index}`}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-200 relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {property.rating} ({property.reviews})
                      </Badge>
                      <span className="font-bold text-lg">
                        {property.price}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {property.location}
                    </p>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-auto py-2">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {propertyData.map((property, index) => (
              <Card
                key={`events-second-${index}`}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-200 relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {property.rating} ({property.reviews})
                      </Badge>
                      <span className="font-bold text-lg">
                        {property.price}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {property.location}
                    </p>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-auto py-2">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyData.map((property, index) => (
              <Card
                key={`events-third-${index}`}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-200 relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {property.rating} ({property.reviews})
                      </Badge>
                      <span className="font-bold text-lg">
                        {property.price}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {property.location}
                    </p>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-auto py-2">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Coslay Makes Hotel Sharing */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              How coslay makes hotel sharing safe and simple
            </h2>
            <p className="text-gray-600">
              We've built the tools and safeguards to make sharing
              accommodations worry-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-none">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Community */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Community</h2>
            <p className="text-gray-600">
              See what our travelers are saying about their Coslay experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialData.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Avatar className="mr-3">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-teal-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start your journey with Coslay today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who are saving money and making friends
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="flex-1 bg-white text-black h-12"
            />
            <Button className="bg-white text-teal-500 hover:bg-gray-100 h-12 px-8">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-4">Coslay</h3>
              <p className="text-teal-100 text-sm">
                Making travel affordable and social through shared
                accommodations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-teal-100 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-teal-100 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Hosting</h4>
              <ul className="space-y-2">
                {footerLinks.hosting.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-teal-100 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-teal-100 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-teal-500" />

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-teal-100 text-sm">
              © 2024 Coslay. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a
                href="#"
                className="text-teal-100 hover:text-white text-sm transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-teal-100 hover:text-white text-sm transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-teal-100 hover:text-white text-sm transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
