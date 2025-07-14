import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// fields is accept array, because we need lot of image file get

router.route("/register").post(
  upload.fields([
    // Should be assure implement in frontend as like same name , "avatar"
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser,
);

export default router;
