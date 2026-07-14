-- schema.sql
-- Direct PostgreSQL Schema and Index Configuration for Government Smart Queue Management System

-- 1. Create Enums
CREATE TYPE "Role" AS ENUM ('CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "TokenStatus" AS ENUM ('PENDING', 'CALLING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'CANCELLED');
CREATE TYPE "PriorityLevel" AS ENUM ('REGULAR', 'SENIOR_CITIZEN', 'DISABLED', 'EMERGENCY');
CREATE TYPE "CounterStatus" AS ENUM ('OPEN', 'CLOSED', 'PAUSED');

-- 2. Create Departments Table
CREATE TABLE "Department" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL,
  "code" VARCHAR(50) UNIQUE NOT NULL,
  "icon" VARCHAR(100) NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Services Table
CREATE TABLE "Service" (
  "id" VARCHAR(255) PRIMARY KEY,
  "departmentId" VARCHAR(255) NOT NULL REFERENCES "Department"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "avgMinutes" INTEGER NOT NULL DEFAULT 15,
  "description" TEXT NOT NULL,
  "requiredDocuments" TEXT[] NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Users Table
CREATE TABLE "User" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "role" "Role" NOT NULL DEFAULT 'CITIZEN',
  "departmentId" VARCHAR(255) REFERENCES "Department"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Counters Table
CREATE TABLE "Counter" (
  "id" VARCHAR(255) PRIMARY KEY,
  "counterNumber" INTEGER NOT NULL,
  "departmentId" VARCHAR(255) NOT NULL REFERENCES "Department"("id") ON DELETE CASCADE,
  "officerId" VARCHAR(255),
  "officerName" VARCHAR(255),
  "status" "CounterStatus" NOT NULL DEFAULT 'CLOSED',
  "currentTokenId" VARCHAR(255),
  "currentTokenNumber" VARCHAR(50),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Appointments Table
CREATE TABLE "Appointment" (
  "id" VARCHAR(255) PRIMARY KEY,
  "citizenName" VARCHAR(255) NOT NULL,
  "mobile" VARCHAR(50) NOT NULL,
  "email" VARCHAR(255),
  "departmentId" VARCHAR(255) NOT NULL,
  "serviceId" VARCHAR(255) NOT NULL REFERENCES "Service"("id") ON DELETE CASCADE,
  "date" DATE NOT NULL,
  "slot" VARCHAR(100) NOT NULL,
  "status" VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Tokens Table
CREATE TABLE "Token" (
  "id" VARCHAR(255) PRIMARY KEY,
  "tokenNumber" VARCHAR(50) UNIQUE NOT NULL,
  "sequence" INTEGER NOT NULL,
  "citizenName" VARCHAR(255) NOT NULL,
  "mobile" VARCHAR(50) NOT NULL,
  "email" VARCHAR(255),
  "aadhaar" VARCHAR(50),
  "status" "TokenStatus" NOT NULL DEFAULT 'PENDING',
  "priority" "PriorityLevel" NOT NULL DEFAULT 'REGULAR',
  "departmentId" VARCHAR(255) NOT NULL REFERENCES "Department"("id") ON DELETE CASCADE,
  "serviceId" VARCHAR(255) NOT NULL REFERENCES "Service"("id") ON DELETE CASCADE,
  "counterId" VARCHAR(255) REFERENCES "Counter"("id") ON DELETE SET NULL,
  "counterNumber" INTEGER,
  "estimatedWaitMinutes" INTEGER NOT NULL DEFAULT 15,
  "queuePosition" INTEGER NOT NULL DEFAULT 1,
  "slot" VARCHAR(50) NOT NULL DEFAULT 'MORNING',
  "isOnlineBooked" BOOLEAN NOT NULL DEFAULT FALSE,
  "appointmentId" VARCHAR(255) UNIQUE REFERENCES "Appointment"("id") ON DELETE SET NULL,
  "calledAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Feedbacks Table
CREATE TABLE "Feedback" (
  "id" VARCHAR(255) PRIMARY KEY,
  "tokenNumber" VARCHAR(50) NOT NULL,
  "citizenName" VARCHAR(255) NOT NULL,
  "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
  "comments" TEXT NOT NULL,
  "sentiment" VARCHAR(50),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Audit Logs Table
CREATE TABLE "AuditLog" (
  "id" VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL,
  "userName" VARCHAR(255) NOT NULL,
  "role" VARCHAR(100) NOT NULL,
  "action" VARCHAR(100) NOT NULL,
  "details" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Core Performance Indexes for Priority Queueing (Critical for Real-time FIFO rearrangement)
CREATE INDEX "idx_token_queue_sorting" ON "Token" ("departmentId", "status", "priority" DESC, "createdAt" ASC);
CREATE INDEX "idx_token_citizen_lookup" ON "Token" ("mobile", "citizenName", "aadhaar");
CREATE INDEX "idx_counter_department" ON "Counter" ("departmentId", "status");
CREATE INDEX "idx_appointment_date_slot" ON "Appointment" ("date", "slot");
CREATE INDEX "idx_auditlog_created" ON "AuditLog" ("createdAt" DESC);
