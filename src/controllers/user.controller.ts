import { Request, Response } from "express";
import { success } from "zod";
const getUserByIdAPI = (req: Request, res: Response) => {
    return res.status(200).json({
        success: true, 
        message: "User profile",
        data: {user: req.user} 
    });
    
}

export { getUserByIdAPI }