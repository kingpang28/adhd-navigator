import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Screening Results Table - Stores ASRS v1.1 screening questionnaire responses
 * Each user can have multiple screening attempts over time
 */
export const screeningResults = mysqlTable("screening_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  // Part A scoring (6 questions, 0-6 positive indicators)
  partAScore: int("partAScore").notNull().default(0),
  // Likelihood classification: "Low", "Moderate", "High"
  likelihood: varchar("likelihood", { length: 20 }).notNull().default("Low"),
  // Raw responses for each of the 6 Part A questions (1-5 scale)
  q1Response: int("q1Response"),
  q2Response: int("q2Response"),
  q3Response: int("q3Response"),
  q4Response: int("q4Response"),
  q5Response: int("q5Response"),
  q6Response: int("q6Response"),
  // Timestamp of screening completion
  completedAt: timestamp("completedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScreeningResult = typeof screeningResults.$inferSelect;
export type InsertScreeningResult = typeof screeningResults.$inferInsert;

/**
 * Vitals Records Table - Stores blood pressure and heart rate measurements
 * Multiple records per user to track changes over time
 */
export const vitalsRecords = mysqlTable("vitals_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  // Blood pressure readings (mmHg)
  systolicBP: int("systolicBP").notNull(),
  diastolicBP: int("diastolicBP").notNull(),
  // Heart rate (beats per minute)
  heartRate: int("heartRate").notNull(),
  // Medication readiness status: "Ready", "Requires Review"
  medicationReadiness: varchar("medicationReadiness", { length: 20 }).notNull().default("Requires Review"),
  // Notes about the measurement
  notes: text("notes"),
  recordedAt: timestamp("recordedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VitalsRecord = typeof vitalsRecords.$inferSelect;
export type InsertVitalsRecord = typeof vitalsRecords.$inferInsert;

/**
 * Clinic Preferences Table - Stores user's preferred clinics and referral choices
 */
export const clinicPreferences = mysqlTable("clinic_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  // Clinic name (e.g., "Psychiatry-UK", "ADHD 360")
  clinicName: varchar("clinicName", { length: 100 }).notNull(),
  // Whether this clinic is marked as preferred
  isPreferred: int("isPreferred").default(0).notNull(),
  // Notes about why this clinic was chosen
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClinicPreference = typeof clinicPreferences.$inferSelect;
export type InsertClinicPreference = typeof clinicPreferences.$inferInsert;