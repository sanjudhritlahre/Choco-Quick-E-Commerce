CREATE TABLE "warehouses" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
