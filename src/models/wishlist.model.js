import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {

    _id: false,
  },
);


const wishlistSchema = new mongoose.Schema(
  {

    userId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  {

    timestamps: true,

    versionKey: false,
  },
);

wishlistSchema.index({
  "items.productId": 1,
});

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model(
    "Wishlist",
    wishlistSchema,
  );

export default Wishlist;