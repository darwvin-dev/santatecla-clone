import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// declare global for TypeScript
declare global {
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Global cache
let globalWithMongoose = globalThis as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (globalWithMongoose._mongoose!.conn) {
    return globalWithMongoose._mongoose!.conn;
  }

  if (!globalWithMongoose._mongoose!.promise) {
    globalWithMongoose._mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    
    });
  }

  globalWithMongoose._mongoose!.conn = await globalWithMongoose._mongoose!.promise;
  return globalWithMongoose._mongoose!.conn;
}

export default dbConnect;
