import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// Настраиваем хранилище для файлов с помощью multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка, в которую будут сохраняться загруженные файлы
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.username = username;
        user.password = hashedPassword;
        user.role = "admin";

        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save(user);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ username });

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Используем multer для обработки загрузки изображения профиля
export const updateUserProfile = [
    upload.single('profileImage'), // Используем multer для загрузки одного файла
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.id;
        const {
            email,
            name,
            city,
            activity,
            phone,
            instagram,
            vk,
            telegram,
            facebook,
            about,
            receiveNewsletter,
        } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: Number(userId) });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Обновляем поля пользователя
            user.email = email ?? user.email;
            user.name = name ?? user.name;
            user.city = city ?? user.city;
            user.activity = activity ?? user.activity;
            user.phone = phone ?? user.phone;
            user.instagram = instagram ?? user.instagram;
            user.vk = vk ?? user.vk;
            user.telegram = telegram ?? user.telegram;
            user.facebook = facebook ?? user.facebook;
            user.about = about ?? user.about;
            user.receiveNewsletter = receiveNewsletter ?? user.receiveNewsletter;

            // Если файл был загружен, добавляем путь к изображению профиля
            if (req.file) {
                user.profileImage = path.join('uploads', req.file.filename);
            }

            await userRepository.save(user);

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
];
