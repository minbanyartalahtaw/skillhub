import "server-only"

import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI is not set. Copy .env.sample to .env.")
}

// In dev, hot reload re-evaluates this module on every change. Caching the
// client on globalThis keeps a single connection pool instead of leaking a new
// one per reload.
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const clientPromise =
  globalForMongo._mongoClientPromise ?? new MongoClient(uri).connect()

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClientPromise = clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  // Database name comes from the URI path (…/skillhub).
  return client.db()
}
