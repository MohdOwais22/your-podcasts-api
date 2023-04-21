import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";

connectDB();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


app.listen(process.env.PORT, () => {
    console.log(
      `Server listening on port: ${process.env.PORT}, in ${process.env.NODE_ENV} MODE.`
    );
});