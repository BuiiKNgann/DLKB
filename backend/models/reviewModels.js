import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
