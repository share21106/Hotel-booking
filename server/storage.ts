import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import 'dotenv/config';

import { users, hotels, rooms, bookings, reviews, availability, type User, type InsertUser, type Hotel, type Room, type Booking, type Review } from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hotel methods
  getHotels(): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  createHotel(hotel: any): Promise<Hotel>;
  
  // Room methods
  getRoomsByHotel(hotelId: number): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: any): Promise<Room>;
  
  // Booking methods
  getBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: any): Promise<Booking>;
  
  // Review methods
  getReviewsByHotel(hotelId: number): Promise<Review[]>;
  createReview(review: any): Promise<Review>;
  
}
export type ReviewWithHotel = {
  id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  hotel: { id: number; name: string } | null;
};
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async getHotels(): Promise<Hotel[]> {
    return await db.select().from(hotels).where(eq(hotels.isActive, true));
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    const result = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1);
    return result[0];
  }

  async createHotel(hotel: any): Promise<Hotel> {
    const result = await db.insert(hotels).values({
      ...hotel,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getRoomsByHotel(hotelId: number): Promise<Room[]> {
    return await db.select().from(rooms).where(eq(rooms.hotelId, hotelId));
  }

  async getRoom(id: number): Promise<Room | undefined> {
    const result = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
    return result[0];
  }

  async createRoom(room: any): Promise<Room> {
    const result = await db.insert(rooms).values({
      ...room,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async createBooking(booking: any): Promise<Booking> {
    const result = await db.insert(bookings).values({
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async getReviewsByHotel(hotelId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.hotelId, hotelId));
  }

  async getReviewsByUser(userId: number): Promise<ReviewWithHotel[]> {
    return await db.select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      hotel: {
        id: hotels.id,
        name: hotels.name,
      }
    })
    .from(reviews)
    .leftJoin(hotels, eq(reviews.hotelId, hotels.id))
    .where(eq(reviews.userId, userId));
  }

  async createReview(review: any): Promise<Review> {
    const result = await db.insert(reviews).values({
      ...review,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
