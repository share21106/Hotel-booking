import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull().default("guest"), // guest, hotel_partner, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone"),
  email: text("email"),
  amenities: json("amenities").$type<string[]>(),
  images: json("images").$type<string[]>(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  partnerId: integer("partner_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  roomNumber: text("room_number").notNull(),
  type: text("type").notNull(), // single, double, suite, etc.
  capacity: integer("capacity").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  amenities: json("amenities").$type<string[]>(),
  images: json("images").$type<string[]>(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  roomId: integer("room_id").references(() => rooms.id).notNull(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentIntentId: text("payment_intent_id"),
  guestCount: integer("guest_count").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, completed
  isSplitPayment: boolean("is_split_payment").default(false),
  splitPaymentData: json("split_payment_data").$type<{
    participants: { email: string; amount: number; paid: boolean }[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => rooms.id).notNull(),
  date: timestamp("date").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  priceOverride: decimal("price_override", { precision: 10, scale: 2 }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
  userType: true,
});

export const insertHotelSchema = createInsertSchema(hotels);
export const insertRoomSchema = createInsertSchema(rooms);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertReviewSchema = createInsertSchema(reviews);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Hotel = typeof hotels.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
