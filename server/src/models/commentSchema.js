import mongoose from "mongoose";

const CommentModel = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("comments", CommentModel);
