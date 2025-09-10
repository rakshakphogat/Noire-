import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error("Create mongoDB url");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        dbName: "noire",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("Connected");
        return mongoose;
      })
      .catch((err) => {
        console.log("Error connecting mongoDB");
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
