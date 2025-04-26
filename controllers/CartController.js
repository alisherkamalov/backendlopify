import { CartItemModel } from "../models/Cart.js";
import { ProductModel } from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    // Проверка, существует ли продукт
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    // Проверка, есть ли уже товар в корзине
    const existingItem = await CartItemModel.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: "Этот товар уже в корзине" });
    }

    // Добавление товара в корзину
    const newCartItem = new CartItemModel({
      userId,
      productId
    });
    await newCartItem.save();

    res.status(201).json({ message: "Товар добавлен в корзину", newCartItem });
  } catch (err) {
    res.status(500).json({ message: `Не удалось добавить товар в корзину: ${err}` });
  }
};
export const removeFromCart = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.userId;
  
      // Находим товар в корзине
      const cartItem = await CartItemModel.findOneAndDelete({ userId, productId });
      if (!cartItem) {
        return res.status(404).json({ message: "Товар не найден в корзине" });
      }
  
      res.status(200).json({ message: "Товар удален из корзины" });
    } catch (err) {
      res.status(500).json({ message: `Не удалось удалить товар из корзины: ${err}` });
    }
  };
  export const getCartItems = async (req, res) => {
    try {
      const userId = req.userId;
  
      // Получаем все товары в корзине пользователя
      const cartItems = await CartItemModel.find({ userId }).populate("productId", "name price photoUrl videoUrl deviceType");
  
      if (cartItems.length === 0) {
        return res.status(404).json({ message: "Корзина пуста" });
      }
  
      res.status(200).json(cartItems);
    } catch (err) {
      res.status(500).json({ message: `Не удалось получить товары из корзины: ${err}` });
    }
  };
    