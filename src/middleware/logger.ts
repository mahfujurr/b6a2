import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
}
export default logger;
