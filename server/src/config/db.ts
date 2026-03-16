import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("MONGO_URI is not defined");

    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully");

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default connectDB;