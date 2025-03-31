
CREATE TYPE "public"."user_role" AS ENUM('buyer', 'seller', 'admin');
CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "username" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "role" "user_role" DEFAULT 'buyer' NOT NULL,
  "name" text NOT NULL,
  "birthday" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "stripe_customer_id" text,
  "google_id" text
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" serial PRIMARY KEY NOT NULL,
  "seller_id" integer NOT NULL REFERENCES "users"("id"),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "price" numeric NOT NULL,
  "quantity_available" integer NOT NULL,
  "images" text[] NOT NULL,
  "category" text NOT NULL,
  "color_options" text[],
  "variants" text[],
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" serial PRIMARY KEY NOT NULL,
  "buyer_id" integer NOT NULL REFERENCES "users"("id"),
  "total_amount" numeric NOT NULL,
  "order_status" "order_status" DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "order_id" integer NOT NULL REFERENCES "orders"("id"),
  "product_id" integer NOT NULL REFERENCES "products"("id"),
  "quantity" integer NOT NULL,
  "unit_price" numeric NOT NULL,
  "selected_color" text,
  "selected_variant" text
);

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL REFERENCES "products"("id"),
  "buyer_id" integer NOT NULL REFERENCES "users"("id"),
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "sender_id" integer NOT NULL REFERENCES "users"("id"),
  "receiver_id" integer NOT NULL REFERENCES "users"("id"),
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id"),
  "product_id" integer NOT NULL REFERENCES "products"("id"),
  "quantity" integer NOT NULL,
  "selected_color" text,
  "selected_variant" text
);

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id"),
  "title" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "type" varchar(50) NOT NULL,
  "is_read" boolean DEFAULT false NOT NULL,
  "data" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "product_modification_requests" (
  "id" serial PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL REFERENCES "products"("id"),
  "buyer_id" integer NOT NULL REFERENCES "users"("id"),
  "seller_id" integer NOT NULL REFERENCES "users"("id"),
  "request_details" text NOT NULL,
  "status" varchar(50) DEFAULT 'pending' NOT NULL,
  "seller_response" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
