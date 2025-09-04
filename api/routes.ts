import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../server/storage";
import bcrypt from "bcryptjs";
import session from "express-session";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";
import 'dotenv/config';
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'hotel-booking-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userResponse } = newUser;
      
      // Create session
      (req.session as any).userId = newUser.id;
      (req.session as any).userType = newUser.userType;

      res.status(201).json({ user: userResponse });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).userType = user.userType;

      // Remove password from response
      const { password: _, ...userResponse } = user;
      
      res.json({ user: userResponse });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      console.error("Auth me error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!(req.session as any)?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Hotel routes
  app.get("/api/hotels", async (req, res) => {
    try {
      const hotels = await storage.getHotels();
      res.json(hotels);
    } catch (error) {
      console.error("Get hotels error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id);
      const hotel = await storage.getHotel(hotelId);
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      res.json(hotel);
    } catch (error) {
      console.error("Get hotel error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/hotels/:id/rooms", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id);
      const rooms = await storage.getRoomsByHotel(hotelId);
      res.json(rooms);
    } catch (error) {
      console.error("Get rooms error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User dashboard routes
  app.get("/api/user/bookings", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Get user bookings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Booking routes
  app.post("/api/bookings", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const {
        hotelId,
        roomId,
        checkInDate,
        checkOutDate,
        guestCount,
        specialRequests,
        isSplitPayment,
        splitPaymentData
      } = req.body;

      // Calculate total amount based on room price and number of nights
      const room = await storage.getRoom(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = parseFloat(room.pricePerNight) * nights;

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
        currency: 'usd',
        metadata: {
          hotelId: hotelId.toString(),
          roomId: roomId.toString(),
          userId: userId.toString(),
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
          guestCount: guestCount.toString(),
          isSplitPayment: isSplitPayment ? 'true' : 'false'
        }
      });

      const booking = await storage.createBooking({
        userId,
        hotelId: parseInt(hotelId),
        roomId: parseInt(roomId),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalAmount: totalAmount.toString(),
        guestCount: parseInt(guestCount),
        specialRequests,
        paymentStatus: 'pending',
        paymentIntentId: paymentIntent.id,
        status: 'confirmed',
        isSplitPayment: !!isSplitPayment,
        splitPaymentData: splitPaymentData || null
      });

      res.status(201).json({
        booking,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const userId = (req.session as any).userId;
      
      // Get booking with user verification
      const bookings = await storage.getBookingsByUser(userId);
      const booking = bookings.find(b => b.id === bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reviews routes
  app.get("/api/hotels/:id/reviews", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByHotel(hotelId);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const { bookingId, hotelId, rating, title, comment } = req.body;

      // Verify the booking belongs to the user and is completed
      const bookings = await storage.getBookingsByUser(userId);
      const booking = bookings.find(b => b.id === parseInt(bookingId) && b.status === 'completed');

      if (!booking) {
        return res.status(400).json({ message: "Can only review completed bookings" });
      }

      const review = await storage.createReview({
        bookingId: parseInt(bookingId),
        userId,
        hotelId: parseInt(hotelId),
        rating: parseInt(rating),
        title,
        comment
      });

      res.status(201).json(review);
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Payment confirmation route
  app.post("/api/payments/confirm", requireAuth, async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const userId = (req.session as any).userId;

      // Retrieve payment intent from Stripe to verify it's been paid
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Find and update the booking
        const bookings = await storage.getBookingsByUser(userId);
        const booking = bookings.find(b => b.paymentIntentId === paymentIntentId);
        
        if (booking) {
          // For now, just return success - in production you'd update the booking status
          res.json({ success: true, booking });
        } else {
          res.status(404).json({ message: "Booking not found" });
        }
      } else {
        res.status(400).json({ message: "Payment not completed" });
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get Stripe publishable key for frontend
  app.get("/api/stripe/config", (req, res) => {
    res.json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  });

  // Get user bookings
  app.get("/api/bookings/my-bookings", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Get user bookings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user reviews
  app.get("/api/reviews/my-reviews", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Get user reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
