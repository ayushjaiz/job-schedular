import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env'

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send({ status: false, message: 'Email and password is required' });
            return;
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).send({ status: false, message: 'Email is already registered' });
            return;
        }

        // Create new user
        const user = new UserModel({ email, password });
        await user.save();

        res.status(201).send({ status: true, message: 'User registered successfully' });
    } catch (error: any) {
        res.status(500).send({ status: false, error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401).send({ status: false, message: 'Invalid email or password' });
            return;
        }

        // Validate password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).send({ status: false, message: 'Invalid email or password' });
            return;
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email, role : user.role }, envConfig.jwtSecret, {
            expiresIn: '1h',
        });

        res.cookie('token', token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

        res.send({ status: true, message: 'Login successful', token });
    } catch (error: any) {
        res.status(500).send({ status: false, error: error.message });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    res.cookie('token', '', { maxAge: 1 });
    res.status(200).json({ message: 'Logged out successfully' });
}

