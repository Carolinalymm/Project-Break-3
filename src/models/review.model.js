import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {

    productId: {
      type: Number,
      required: true,
      index: true,
    },

    userId: {
      type: Number,
      required: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },


    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
  },
  {

    timestamps: true,

    versionKey: false,
  },
);

reviewSchema.index(
  {
    productId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);
const Review =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);

export default Review;