import mongoose, { Connection } from "mongoose";


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