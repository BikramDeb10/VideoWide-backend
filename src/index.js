import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();
// { path: "./env", }

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Server error on port:", error);
      process.exit(1);
    });

    app.listen(port, () => {
      console.log(`Server running on port: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Failed !!!", err);
  });
