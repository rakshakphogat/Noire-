import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error("Please define the MONGODB_URL environment variable");
}

declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

const cached =
  global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        dbName: "noire",
        bufferCommands: false,
      })
      .then((m) => {
        console.log("Connected to MongoDB");
        return m;
      })
      .catch((err) => {
        console.error("Error connecting MongoDB", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
