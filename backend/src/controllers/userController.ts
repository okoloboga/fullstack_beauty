import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.username = username;
        user.password = hashedPassword;
        user.role = role;

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
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials" });
            return
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
