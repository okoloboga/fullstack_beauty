import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import nodemailer from 'nodemailer';

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
    const { password, email } = req.body; // Добавляем email
    console.log(`Запрос на регистрацию нового пользователя: ${email}`);
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    console.log('User:', user);
    
    if (user) {
        console.warn(`Пользователь с почтой: ${email} уже зарегистрирован`);
        res.status(400).json({ message: "Пользователь с таким именем уже зарегистрирован" });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.password = hashedPassword;
        user.role = "admin";
        user.email = email; // Сохраняем email

        // Генерация уникального токена подтверждения
        const confirmationToken = uuidv4();
        user.confirmationToken = confirmationToken;
        user.confirmationTokenExpiration = new Date(Date.now() + 3600000); // Токен действителен 1 час

        await userRepository.save(user);

        // Настройки для отправки письма
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Твой email
                pass: process.env.EMAIL_PASS,  // Твой пароль приложения
            },
        });

        // Ссылка на подтверждение регистрации
        const confirmationUrl = `http://localhost:3000/confirm-email?token=${confirmationToken}`;

        // Письмо с подтверждением
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Отправляем на email пользователя
            subject: 'Подтверждение регистрации',
            text: `Спасибо за регистрацию! Пожалуйста, подтвердите вашу почту, перейдя по ссылке: ${confirmationUrl}`,
        };

        // Отправка письма
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Ошибка при отправке письма:', error);
            } else {
                console.log('Письмо отправлено: ' + info.response);
            }
        });

        console.log(`Пользователь ${email} успешно зарегистрирован`);
        res.status(201).json({ message: "Регистрация успешно завершена. Письмо с подтверждением отправлено." });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

// Подтверждение email
export const confirmEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.query;

        if (!token) {
            res.status(400).json({ message: 'Токен подтверждения не указан' });
            return
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ confirmationToken: token as string });

        if (!user) {
            res.status(400).json({ message: 'Неверный или просроченный токен' });
            return
        }

        // Проверка срока действия токена
        if (!user.confirmationTokenExpiration || user.confirmationTokenExpiration < new Date()) {
            res.status(400).json({ message: 'Токен истек' });
            return
        }

        // Подтверждение почты
        user.confirmationToken = null;
        user.confirmationTokenExpiration = null;
        user.isConfirmed = true;

        await userRepository.save(user);

        res.status(200).json({ message: 'Почта успешно подтверждена' });
    } catch (error) {
        console.error("Ошибка при подтверждении email:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

// Вход пользователя
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    console.log(`Запрос на вход для пользователя: ${email}`);

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            console.warn(`Попытка входа с несуществующим именем пользователя: ${email}`);
            res.status(400).json({ message: "Неверные данные!" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.warn(`Неверный пароль для пользователя: ${email}`);
            res.status(400).json({ message: "Неверные данные!" });
            return;
        }

        const token = jwt.sign({ user: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });
        console.log(`Пользователь ${email} успешно вошел в систему`);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Ошибка при входе пользователя:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    console.log('Запрос на восстановление пароля:', email);
  
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
        res.status(400).json({ message: 'Пользователь с таким email не найден' });
        return
    }

    try {
        // Генерация токена для восстановления пароля
        const resetToken = uuidv4();
        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 3600000); // Токен действителен 1 час
    
        await userRepository.save(user);
    
        // Отправка ссылки на почту
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Восстановление пароля',
            text: `Для восстановления пароля перейдите по следующей ссылке: ${resetUrl}`,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Ошибка при отправке письма:', error);
                return res.status(500).json({ message: 'Ошибка при отправке письма' });
            } else {
                console.log('Письмо отправлено: ' + info.response);
                return res.status(200).json({ message: 'Ссылка для восстановления пароля отправлена на ваш email' });
            }
        });
    } catch (error) {
        console.error("Ошибка при восстановлении пароля:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
        return
    }
};


// Восстановление пароля
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    console.log('Результат восстановления пароля');

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ resetToken: token });
    
        if (!user) {
            res.status(400).json({ message: 'Неверный или просроченный токен' });
            return
        }
    
        if (!user.resetTokenExpiration || user.resetTokenExpiration < new Date()) {
        res.status(400).json({ message: 'Неверный или просроченный токен' });
        return
        }
    
        // Хешируем новый пароль
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Обновляем пароль пользователя
        user.password = hashedPassword;
        user.resetToken = null; // Убираем токен после использования
        user.resetTokenExpiration = null;
    
        await userRepository.save(user);
    
        res.status(200).json({ message: 'Пароль успешно обновлен' });
    } catch (error) {
        console.error("Ошибка при восстановлении пароля", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  };

// Обновление профиля пользователя
export const updateUserProfile = [
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'portfolioImage', maxCount: 1 }
    ]),
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.id;
        const {
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
                console.warn(`Пользователь с id: ${user} не найден`);
                res.status(404).json({ message: "Пользователь не найден..." });
                return;
            }

            // Обновляем поля пользователя
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

            // Проверяем наличие загруженных файлов и обновляем соответствующие поля
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (files?.profileImage && files.profileImage[0]) {
                console.log(`Загрузка изображения профиля для пользователя с id: ${user}`);
                user.profileImage = path.join('uploads', files.profileImage[0].filename);
            }

            if (files?.portfolioImage && files.portfolioImage[0]) {
                console.log(`Загрузка изображения портфолио для пользователя с id: ${user}`);
                user.portfolioImage = path.join('uploads', files.portfolioImage[0].filename);
            }

            await userRepository.save(user);

            console.log(`Профиль пользователя с id: ${user} успешно обновлен`);
            res.status(200).json({ message: "Профиль успешно обновлен" });
        } catch (error) {
            console.error("Ошибка при обновлении профиля пользователя:", error);
            res.status(500).json({ message: "Внутренняя ошибка сервера" });
        }
    }
];

// Получить данные профиля пользователя
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    console.log(`Запрос на получение профиля пользователя с id: ${userId}`);

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: Number(userId) });

        if (!user) {
            console.warn(`Пользователь с id: ${user} не найден`);
            res.status(404).json({ message: "Пользователь не найден..." });
            return;
        }

        // Здесь можно выбрать только нужные данные профиля для ответа
        const { id, email, name, city, activity, phone, instagram, vk, telegram, facebook, about, receiveNewsletter, profileImage, portfolioImage } = user;

        console.log(`Профиль пользователя с id: ${user} успешно получен`);
        res.status(200).json({
            id,
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
            profileImage,
            portfolioImage
        });
    } catch (error) {
        console.error("Ошибка при получении профиля пользователя:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};