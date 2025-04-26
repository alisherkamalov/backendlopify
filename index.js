import express from "express";
import { loginValidation, registerValidation } from "./validators/auth.js";
import { HandleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, OrderController, ProductController } from "./controllers/index.js";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

// Подключение к базе данных
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DATABASE OK"))
  .catch((err) => console.log("error", err));

// Инициализация сервера
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use("/upload", express.static("upload"));
app.use(cors({
  origin: [
    "http://localhost:5252", 
    "https://loopify-five.vercel.app", 
    "http://localhost:3000", 
    "backendlopify-production.up.railway.app"
  ],
  methods: ["POST", "GET", "DELETE", "OPTIONS", "HEAD", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Роуты
app.get("/me", checkAuth, UserController.getMe);
app.get("/products", checkAuth, ProductController.getAllProducts);
app.get("/orders", checkAuth, OrderController.getUserOrders);

app.post("/login", loginValidation, HandleValidationErrors, UserController.login);
app.post("/register", registerValidation, HandleValidationErrors, UserController.register);

app.post(
  "/products",
  checkAuth,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  ProductController.createProduct
);

app.post("/orders", checkAuth, OrderController.createOrder);
app.put("/orders/:orderId/delivered", checkAuth, OrderController.markOrderAsDelivered);

export default app;
