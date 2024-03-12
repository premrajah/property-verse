import mongoose from 'mongoose'

let connected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true)

    // do not connect if already connected 
    if (connected) {
        console.log("MongoDB already connected...  ");
        return;
    }

    // connect to db
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        connected = true;
        console.log("MongoDB connected ...");

    } catch (error) {
        console.log("MongoDB connection error ", error);
    }
}

export default connectDB;