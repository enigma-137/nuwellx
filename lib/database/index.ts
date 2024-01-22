// Please this code is a TypeScript module that provides a function (connectToDatabase)
//  for connecting to a MongoDB database using the Mongoose library.
//  It utilizes caching to avoid redundant database connections Thank you./ 

import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    // Check if connection exists
    if (cached.conn) return cached.conn;

    // Check if MONGODB_URL is defined
    if (!MONGODB_URL) throw new Error("Invalid MongoDB URL");

    // If not connected, establish a new connection
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: "evento",
        bufferCommands: false,
    });

    // Await the connection promise and set it to the cached connection
    cached.conn = await cached.promise;

    // Return the connection
    return cached.conn;
};

