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

// Регистрация пользователя
export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(`Запрос на регистрацию нового пользователя: ${username}`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.username = username;
        user.password = hashedPassword;
        user.role = "admin";

        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save(user);

        console.log(`Пользователь ${username} успешно зарегистрирован`);
        res.status(201).json({ message: "Регистрация успешно завершена" });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

// Вход пользователя
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    console.log(`Запрос на вход для пользователя: ${username}`);

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ username });

        if (!user) {
            console.warn(`Попытка входа с несуществующим именем пользователя: ${username}`);
            res.status(400).json({ message: "Неверные данные!" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.warn(`Неверный пароль для пользователя: ${username}`);
            res.status(400).json({ message: "Неверные данные!" });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });
        console.log(`Пользователь ${username} успешно вошел в систему`);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Ошибка при входе пользователя:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

// Обновление профиля пользователя
export const updateUserProfile = [
    upload.single('profileImage'),
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

        console.log(`Запрос на обновление профиля пользователя с id: ${userId}`);

        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: Number(userId) });

            if (!user) {
                console.warn(`Пользователь с id: ${userId} не найден`);
                res.status(404).json({ message: "Пользователь не найден..." });
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
                console.log(`Загрузка изображения профиля для пользователя с id: ${userId}`);
                user.profileImage = path.join('uploads', req.file.filename);
            }

            await userRepository.save(user);

            console.log(`Профиль пользователя с id: ${userId} успешно обновлен`);
            res.status(200).json({ message: "Профиль успешно обновлен" });
        } catch (error) {
            console.error("Ошибка при обновлении профиля пользователя:", error);
            res.status(500).json({ message: "Внутренняя ошибка сервера" });
        }
    }
];
