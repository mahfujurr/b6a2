import { Request, Response } from "express";
import authService from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    } catch (error: any) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to register user',
            error: error
        });
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user
            }
        })
    } catch (error: any) {
        console.error('Error logging in user:', error);
        
        const status = error.message === 'User not found' || error.message === 'Invalid password' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Failed to log in user',
            error: error
        });
    }
}
const authController = {
    loginUser,
    registerUser
}
export default authController
