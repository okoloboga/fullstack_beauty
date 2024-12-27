import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import nodemailer from 'nodemailer';
import fs from 'fs';

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
    const { email, name, password } = req.body;
    console.log(`[INFO] Запрос на регистрацию нового пользователя: ${email}`);
    
    const userRepository = AppDataSource.getRepository(User);

    try {
        // Проверка существования пользователя
        console.log(`[DEBUG] Проверка существования пользователя с email: ${email}`);
        const existingUser = await userRepository.findOneBy({ email });

        if (existingUser) {
            console.warn(`[WARN] Пользователь с почтой ${email} уже зарегистрирован`);
            res.status(400).json({ message: "Пользователь с таким email уже зарегистрирован." });
            return;
        }

        // Хэширование пароля
        console.log(`[DEBUG] Хэширование пароля для email: ${email}`);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        console.log(`[DEBUG] Создание нового объекта User для email: ${email}`);
        const user = new User();
        user.password = hashedPassword;
        user.name = name;
        user.role = "admin";
        user.email = email;
        user.isConfirmed = false;

        // Генерация токена подтверждения
        const confirmationToken = uuidv4();
        console.log(`[DEBUG] Сгенерирован токен подтверждения для email: ${email}`);
        user.confirmationToken = confirmationToken;
        user.confirmationTokenExpiration = new Date(Date.now() + 3600000); // Токен действителен 1 час

        // Сохранение пользователя в БД
        console.log(`[DEBUG] Сохранение пользователя в БД для email: ${email}`);
        await userRepository.save(user);

        // Настройка почтового транспорта
        console.log(`[DEBUG] Настройка почтового транспорта`);
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true для порта 465, false для других портов
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        

        // Ссылка на подтверждение регистрации
        const confirmationUrl = `http://localhost:3000/confirm-email?token=${confirmationToken}`;
        console.log(`[DEBUG] Ссылка подтверждения: ${confirmationUrl}`);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Спасибо за регистрацию! Пожалуйста, подтвердите вашу почту, перейдя по ссылке: ${confirmationUrl}`,
        };

        // Обёртка sendMail в Promise
        const sendMailAsync = (mailOptions: any): Promise<any> => {
            console.log(`[DEBUG] Отправка письма начата для email: ${email}`);
            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`[ERROR] Ошибка при отправке письма: ${error.message}`);
                        reject(error);
                    } else {
                        console.log(`[DEBUG] Письмо успешно отправлено: ${info.response}`);
                        resolve(info);
                    }
                });
            });
        };

        // Попытка отправки письма
        console.log(`[DEBUG] Попытка отправки письма для email: ${email}`);
        const mailInfo = await sendMailAsync(mailOptions);

        console.log(`[INFO] Письмо отправлено успешно: ${mailInfo.response}`);
        res.status(201).json({ message: "Регистрация завершена. Письмо с подтверждением отправлено." });
    } catch (error) {
        console.error(`[ERROR] Ошибка при обработке регистрации:`, error);

        // Если пользователь был частично создан в БД, удаляем его
        const partialUser = await userRepository.findOneBy({ email });
        if (partialUser) {
            console.log(`[DEBUG] Удаление частично созданного пользователя с email: ${email}`);
            await userRepository.remove(partialUser);
        }

        res.status(500).json({ message: "Внутренняя ошибка сервера." });
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

        const confirmed = user?.isConfirmed

        if (!confirmed) {
            console.warn(`Пользователь ${email} не завершил регистрацию`);
            res.status(400).json({ message: "Почта не подтверждена!" });
            return;
        }

        const token = jwt.sign({ user: user.id, role: user.role, name: user.name }, "secret_key", { expiresIn: "1h" });
        console.log(`Пользователь ${email} успешно вошел в систему`);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Ошибка при входе пользователя:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;;
  
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
    console.log('Результат восстановления пароля:', newPassword);

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
const deleteFile = (filePath: string) => {
    fs.unlink(path.join(__dirname, filePath), (err) => {
        if (err) {
            console.error('Ошибка при удалении файла:', err);
        } else {
            console.log(`Файл ${filePath} успешно удалён`);
        }
    });
};

// Обновление профиля пользователя
export const updateUserProfile = [
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'portfolioImages', maxCount: 10 } // Изменено на множественное число
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

        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: Number(userId) });

            if (!user) {
                console.warn(`Пользователь с id: ${userId} не найден`);
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

            // Проверяем наличие загруженных файлов
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            console.log('Полученные файлы:', files);

            // Обновляем изображение профиля
            if (files?.profileImage && files.profileImage[0]) {
                console.log(`Загрузка изображения профиля для пользователя с id: ${userId}`);
                user.profileImage = path.join('uploads', files.profileImage[0].filename);
            }

            // Обновляем изображения портфолио
            if (files?.portfolioImages) {
                console.log(`Загрузка изображений портфолио для пользователя с id: ${userId}`);
                const portfolioImagePaths = files.portfolioImages.map((file) =>
                    path.join('uploads', file.filename)
                );

                // Убедитесь, что portfolioImages является массивом строк
                if (!Array.isArray(user.portfolioImages)) {
                    user.portfolioImages = [];
                }

                // Фильтруем любые некорректные значения, например, пустые строки
                user.portfolioImages = user.portfolioImages.filter(
                    (item) => typeof item === 'string' && item.trim() !== ''
                );

                // Добавляем новые пути к изображениям портфолио
                user.portfolioImages = [
                    ...user.portfolioImages,
                    ...portfolioImagePaths,
                ];

                console.log('Обновленные portfolioImages:', user.portfolioImages);
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
        const { id, email, name, city, activity, phone, instagram, vk, telegram, facebook, about, rating, articles, reviews, receiveNewsletter, profileImage, portfolioImages } = user;

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
            rating,
            articles,
            reviews,
            receiveNewsletter,
            profileImage,
            portfolioImages
        });
    } catch (error) {
        console.error("Ошибка при получении профиля пользователя:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};

// Получить список пользователей с ролью partner или admin
export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
    console.log("Запрос на получение пользователей с ролью partner или admin");

    try {
        const userRepository = AppDataSource.getRepository(User);
        
        // Получаем пользователей с заданными ролями
        const users = await userRepository.find({
            where: [
                { role: 'partner' },
                { role: 'admin' }
            ],
            select: [
                'id', 
                'email', 
                'name', 
                'city', 
                'activity',
                'phone', 
                'instagram', 
                'vk', 
                'telegram', 
                'facebook', 
                'about', 
                'rating',
                'articles',
                'reviews',
                'receiveNewsletter', 
                'profileImage', 
                'portfolioImages'
            ]
        });

        console.log(`Найдено пользователей: ${users.length}`);
        
        res.status(200).json(users); // Отправляем список пользователей
    } catch (error) {
        console.error("Ошибка при получении списка пользователей:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};