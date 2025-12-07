import express, { NextFunction, Request, Response } from 'express';
import InitDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
const app = express();
app.use(express.json());

InitDB();
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!!!!!!');
});

import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

import { bookingRoutes } from "./modules/booking/booking.routes";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
        path: req.path
    });
});
export default app;