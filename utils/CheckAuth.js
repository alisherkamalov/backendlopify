import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(403).json({ message: "Нет доступа. Токен не предоставлен." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded._id; 

        next();
    } catch (error) {
        return res.status(403).json({ message: "Нет доступа. Токен не действителен." });
    }
};

