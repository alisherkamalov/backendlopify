import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "pending" }, 
    orderNumber: { type: String, unique: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);
const OrderCounterSchema = new mongoose.Schema(
    {
      counter: { type: Number, default: 0 }
    }
  );
  
  const OrderCounter = mongoose.model('OrderCounter', OrderCounterSchema);
  
  OrderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
      const counterDoc = await OrderCounter.findOneAndUpdate(
        {},
        { $inc: { counter: 1 } },
        { new: true, upsert: true }
      );
      this.orderNumber = `#${counterDoc.counter}`;
    }
    next();
  });
const OrderModel = mongoose.model("Order", OrderSchema);
export { OrderModel }
