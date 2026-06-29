import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dpsodynax",
  api_key: process.env.CLOUDINARY_API_KEY || "448541177753886",
  api_secret: process.env.CLOUDINARY_API_SECRET || "yvZr1rmWOgVvIIYPrnwOkxYWMc8",
  secure: true,
});

export default cloudinary;
