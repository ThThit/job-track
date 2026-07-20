import mongoose, { mongo, Mongoose } from "mongoose";
import { cache } from "react";

const MONGODB_URI = String(process.env.MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .evn"
    );
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

// connection
async function connectDB() {
    if (cached.conn) {
        if (cached.conn.connection.readyState === 1) {
            return cached.conn;
        }
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;