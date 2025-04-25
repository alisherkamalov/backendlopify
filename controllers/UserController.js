import UserModel from "../models/User.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const register = async (req, res) => {
    try {
      const password = req.body.password;
      const existingUser = await UserModel.findOne({ email: email.trim() });
      if (existingUser) {
        return res.status(400).json({
          message: 'Пользователь с таким email уже существует',
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const doc = new UserModel({
        nickname: req.body.nickname,
        email: req.body.email.trim(),
        passwordHash: hash,
      });
      const user = await doc.save().catch(err => console.error("Ошибка сохранения:", err));
      const { passwordHash, ...userData } = user._doc;
      res.status(201).json({
        ...userData,
        message: "Вы успешно зарегистрировались",
      });
    } catch (err) {
      console.log("Ошибка регистрации:", err);
      res.status(500).json({
        message: `Не удалось зарегистрироваться в Loopify: ${err}`,
      });
    }
  };
  

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        const isValidPass = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPass) return res.status(401).json({ message: 'Неверная почта или пароль' });
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = user._doc;

        res.status(200).json({
            ...userData,
            token,
            message: "Вы успешно авторизовались",
        });

    } catch (err) {
        console.error("Ошибка авторизации:", err);
        res.status(500).json({ message: `Не удалось авторизоваться в Loopify: ${err}` });
    }
};




export const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const { passwordHash, ... userData } = user._doc;
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json({ message: `Нет доступа: ${err}` });
    }
};
