import {
  updatepassword,
  registerUser,
  updateEmail,
  deleteuser,
  getalluser,
  updateinfo,
  genrateOtp,
  loginUser,
  verifyotp,
  updatepassfromOtp,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAuthorize } from "../middlewares/IsAuthorize.js";
import { Router } from "express";
const userRouter = Router();

userRouter
  .route("/register")
  .post(isAuthorize, upload.single("img_url"), registerUser);
userRouter
  .route("/update-info")
  .post(isAuthorize, upload.single("img_url"), updateinfo);
// userRouter.route("/update-password").post(isAuthorize, updatepassword);
userRouter.route("/update-email").post(isAuthorize, updateEmail);
userRouter.route("/getall-user").get(isAuthorize, getalluser);
userRouter.route("/delete-user").post(isAuthorize, deleteuser);
userRouter.route("/login").post(isAuthorize, loginUser);
userRouter.route("/genrateotp").post(isAuthorize, genrateOtp);
userRouter.route("/verify-otp").post(isAuthorize, verifyotp);
userRouter.route("/update-password").post(isAuthorize, updatepassfromOtp);

export { userRouter };
