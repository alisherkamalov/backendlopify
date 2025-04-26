import express from "express";
import { loginValidation, registerValidation } from "./validators/auth.js";
import { HandleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, OrderController, ProductController } from "./controllers/index.js";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DATABASE OK"))
    .catch((err) => {
      console.error("DATABASE ERROR", err);
      console.log("❌ Попытка переподключения к базе...");
      setTimeout(connectWithRetry, 5000);
    });
};

// Подключаемся к базе данных
connectWithRetry();

// Инициализация сервера
const app = express();
const storage = multer.memoryStorage();

// Установка ограничения на размер загружаемых файлов
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Максимальный размер файла: 50 MB
});

// Настройки CORS
const corsOptions = {
  origin: [
    "http://localhost:5252",
    "https://loopify-five.vercel.app",
    "http://localhost:3000",
    "https://backendlopify-production.up.railway.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Обработка preflight-запросов

// Увеличение лимита для всех POST-запросов
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/upload", express.static("upload"));

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
    { name: "video", maxCount: 1 },
  ]),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(413).json({ message: "File size exceeds the limit" });
    }
    next();
  },
  ProductController.createProduct
);

app.post("/orders", checkAuth, OrderController.createOrder);
app.put("/orders/:orderId/delivered", checkAuth, OrderController.markOrderAsDelivered);

// Запуск сервера
const PORT = process.env.PORT || 4444;

const server = app.listen(PORT, (err) => {
  if (err) {
    return console.error("SERVER ERROR:", err);
  }
  console.log(`Server running on port ${PORT}`);
});

// Аккуратное завершение работы приложения
const gracefulShutdown = async () => {
  console.log("⏳ Завершаем работу сервера...");
  await mongoose.disconnect();
  server.close(() => {
    console.log("✅ Сервер и база данных закрыты. Завершение процесса.");
    process.exit(0);
  });
};

// Обработка сигналов остановки
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

