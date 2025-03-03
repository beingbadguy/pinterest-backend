import mongoose from "mongoose";

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    });
};

export default dbConnect;
