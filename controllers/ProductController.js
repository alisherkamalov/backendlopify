import { ProductModel } from '../models/Product.js';
import uploadImageToCloudinary from '../utils/CloudinaryUpload.js';
import { v2 as cloudinary } from 'cloudinary';

export const createProduct = async (req, res) => {
  try {
    const { name, price, deviceType } = req.body;

    if (!name || !price || !deviceType || !req.files?.photo) {
      return res.status(400).json({ message: 'Обязательные поля: name, price, photo, deviceType' });
    }
    
    const photoFile = req.files.photo[0];
    const photoUrl = await uploadImageToCloudinary(photoFile);

    let videoUrl = undefined;
    if (req.files.video && req.files.video[0]) {
      const videoFile = req.files.video[0];
      const base64Video = `data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`;

      const uploadedVideo = await cloudinary.uploader.upload(base64Video, {
        folder: 'uploads',
        resource_type: 'video'
      });

      videoUrl = uploadedVideo.secure_url;
    }

    const product = new ProductModel({
      name,
      price,
      photoUrl,
      videoUrl,
      deviceType
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find(); 
    res.status(200).json(products);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
