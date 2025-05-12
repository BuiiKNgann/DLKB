import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  addFavoriteDoctor,
  getFavoriteDoctors,
  removeFavoriteDoctor,
  addReview,
  getReviews,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
//upload.single("image") xử lý một file duy nhất được gửi từ client qua field image trong form (thường là file ảnh đại diện).
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/favorite-doctor", authUser, addFavoriteDoctor);
userRouter.get("/favorite-doctors", authUser, getFavoriteDoctors);
userRouter.delete("/favorite-doctor/:doctorId", authUser, removeFavoriteDoctor);
userRouter.post("/add-review", authUser, addReview);
userRouter.get("/get-reviews/:doctorId", getReviews);
export default userRouter;
