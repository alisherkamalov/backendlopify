import { body } from "express-validator";

export const registerValidation = [
  body("nickname").notEmpty().withMessage("Укажите имя"),
  body("email").isEmail().withMessage("Неверный формат почты"),
  body("password").isLength({ min: 8 }).withMessage("Пароль слишком короткий"),
];

export const loginValidation = [
    body("email").isEmail().withMessage("Неверный формат почты"),
    body("password").isLength({ min: 8 }).withMessage("Пароль слишком короткий"),
];
