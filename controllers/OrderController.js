import { OrderModel } from "../models/Order.js";
import { ProductModel } from "../models/Product.js";

export const createOrder = async (req, res) => {
    try {
      const { productId, quantity, city, address } = req.body;
      const userId = req.userId;
  
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
  
      const order = new OrderModel({
        userId,
        productId,
        quantity,
        status: "pending",
        city,
        address
      });
  
      await order.save();
      res.status(201).json({ message: "Заказ успешно создан", order });
    } catch (err) {
      res.status(500).json({ message: `Не удалось создать заказ: ${err}` });
    }
  };

export const markOrderAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    if (order.userId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Вы не можете изменить этот заказ" });
    }

    order.status = "delivered";
    await order.save();

    res.status(200).json({ message: "Заказ доставлен", order });
  } catch (err) {
    res.status(500).json({ message: `Не удалось обновить заказ: ${err}` });
  }
};

export const getUserOrders = async (req, res) => {
    try {
      const orders = await OrderModel.find({ userId: req.userId })
        .populate("productId", "name price photoUrl deviceType");
        
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ message: `Не удалось получить заказы: ${err}` });
    }
  };
  