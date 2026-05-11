import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, screeningResults, vitalsRecords, clinicPreferences } from "../drizzle/schema";
import { InsertScreeningResult, InsertVitalsRecord, InsertClinicPreference } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Screening Results Queries
 */
export async function getLatestScreening(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(screeningResults)
    .where(eq(screeningResults.userId, userId))
    .orderBy((t) => t.completedAt)
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function saveScreening(data: InsertScreeningResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(screeningResults).values(data);
}

/**
 * Vitals Records Queries
 */
export async function getLatestVitals(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(vitalsRecords)
    .where(eq(vitalsRecords.userId, userId))
    .orderBy((t) => t.recordedAt)
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getVitalsHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(vitalsRecords)
    .where(eq(vitalsRecords.userId, userId))
    .orderBy((t) => t.recordedAt);
}

export async function saveVitals(data: InsertVitalsRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(vitalsRecords).values(data);
}

/**
 * Clinic Preferences Queries
 */
export async function getClinicPreferences(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(clinicPreferences)
    .where(eq(clinicPreferences.userId, userId));
}

export async function saveClinicPreference(data: InsertClinicPreference) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clinicPreferences).values(data);
}


