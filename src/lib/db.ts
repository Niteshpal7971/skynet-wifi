import mongoose from "mongoose";


const MongoDB_URL = process.env.MONGODB_URL as string;

if (!MongoDB_URL) {
    throw new Error("MongoDB URL is missing in ENV");
}

let isConnected: boolean = false;
export const connect = async () => {
    try {

        if (isConnected) {
            console.log("Already connected to MongoDb");
            return;
        }

        await mongoose.connect(MongoDB_URL);
        isConnected = true;

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connected successfully")
        });

        connection.on('error', (error) => {
            console.log("MongoDB connection error: Please make sure MongoDb is running.", error);
            process.exit();
        })
    } catch (error) {
        console.log("Somethings went wrong!")
        console.error(error)
    }
}



// import mongoose from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URL as string;

// if (!MONGODB_URL) {
//     throw new Error("Please define the MONGODB_URL environment variable");
// }

// // Extend global type to allow caching the connection
// declare global {
//     var mongooseCache: {
//         conn: typeof mongoose | null;
//         promise: Promise<typeof mongoose> | null;
//     };
// }

// // Initialize global cache if it doesn't exist
// let globalCache = globalThis.mongooseCache;

// if (!globalCache) {
//     globalCache = globalThis.mongooseCache = { conn: null, promise: null };
// }

// export const connect = async () => {
//     if (globalCache.conn) {
//         // ✅ Already connected
//         return globalCache.conn;
//     }

//     if (!globalCache.promise) {
//         // ✅ First time connecting — store the connection promise
//         globalCache.promise = mongoose.connect(MONGODB_URL, {
//             dbName: "your-db-name", // Optional: specify your DB name here
//             bufferCommands: false,
//         });
//     }

//     try {
//         globalCache.conn = await globalCache.promise;
//         console.log("✅ MongoDB connected");
//     } catch (err) {
//         globalCache.promise = null; // Reset promise on failure
//         throw err;
//     }

//     return globalCache.conn;
// };
