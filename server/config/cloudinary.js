import cloudinary from "cloudinary";

const cloudinaryConnection = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("CLoudinary connected");
    return true;
  } catch (error) {
    console.error("Error connecting to Cloudinary:", error);
    process.exit(1);
  }
};

export default cloudinaryConnection;
