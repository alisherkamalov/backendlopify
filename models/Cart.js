import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  createdAt: { type: Date, default: Date.now }
});

const CartItemModel = mongoose.model("CartItem", CartItemSchema);

export { CartItemModel };
