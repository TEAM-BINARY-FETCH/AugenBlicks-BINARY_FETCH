import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDb from "./db/db_connect.js";
import path from "path";
import fileUpload from "express-fileupload";

import authRoutes from "./routes/auth.route.js";
import { protectRoute } from "./middleware/authentication.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.listen(PORT, async() => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});
