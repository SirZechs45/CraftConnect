
import { z } from "zod";
import { sql } from "drizzle-orm";
import { 
  timestamp, 
  pgTableCreator, 
  serial, 
  text, 
  integer, 
  boolean, 
  varchar, 
  decimal, 
  uniqueIndex,
  primaryKey,
  pgEnum
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `artisan_bazaar_${name}`);

// Enums
export const userRoleEnum = pgEnum('user_role', ['buyer', 'seller', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

// Users table
export const users = createTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('buyer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
});

// Products table
export const products = createTable('products', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  images: text('images').array().notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  quantityAvailable: integer('quantity_available').notNull().default(0),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table
export const orders = createTable('orders', {
  id: serial('id').primaryKey(),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  orderStatus: varchar('status', { length: 50 }).notNull().default('pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text('shipping_address'),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order items table
export const orderItems = createTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
});

// Reviews table
export const reviews = createTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Messages table
export const messages = createTable('messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => users.id),
  receiverId: integer('receiver_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Cart items table
export const cartItems = createTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull().default(1),
});

// Define schemas for validation
export const insertUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  username: z.string().min(3).max(255),
  password: z.string().min(6).max(255),
  role: z.enum(['buyer', 'seller', 'admin']).default('buyer'),
});

export const insertProductSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.string(), // Handle as string to avoid precision issues
  images: z.array(z.string()).min(1),
  category: z.string().min(1).max(100),
  quantityAvailable: z.number().int().min(0),
  sellerId: z.number().int(),
});

export const insertOrderSchema = z.object({
  buyerId: z.number().int(),
  orderStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  totalAmount: z.string(), // Handle as string to avoid precision issues
  shippingAddress: z.string().optional(),
  paymentIntentId: z.string().optional(),
});

export const insertOrderItemSchema = z.object({
  orderId: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().int().min(1),
  unitPrice: z.string(), // Handle as string to avoid precision issues
});

export const insertReviewSchema = z.object({
  buyerId: z.number().int(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const insertMessageSchema = z.object({
  senderId: z.number().int(),
  receiverId: z.number().int(),
  content: z.string().min(1),
});

export const insertCartItemSchema = z.object({
  userId: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().int().min(1),
});

// Define types based on the schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
