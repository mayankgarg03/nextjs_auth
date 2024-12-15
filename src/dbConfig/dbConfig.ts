import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB Connected");
    });
    connection.on("error", (err) => {
      console.log(
        "MongoDB Connection Fails! Please check if DB is running and up",
        err
      );
      process.exit(1);
    });
  } catch (error: any) {
    console.error("MongoDB Connection Failed.", error);
  }
}
