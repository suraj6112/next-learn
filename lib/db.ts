import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sky_sfx";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

function redactMongoUri(uri: string) {
  return uri.replace(/\/\/([^:/?#]+):([^@/?#]+)@/, "//***:***@");
}

function getMongoErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    console.log(`[db] MongoDB already connected: ${cached!.conn.connection.host}/${cached!.conn.connection.name}`);
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(`[db] Connecting to MongoDB: ${redactMongoUri(MONGODB_URI)}`);

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(
        `[db] MongoDB connected: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`
      );
      return mongooseInstance;
    });
  } else {
    console.log("[db] Reusing pending MongoDB connection");
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    console.error(`[db] MongoDB connection failed: ${getMongoErrorMessage(e)}`);
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
