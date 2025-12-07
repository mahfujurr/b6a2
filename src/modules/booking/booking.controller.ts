import { Request, Response } from "express";
import bookingService from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        
        
        
        
        
        
        
        
        

        const payload = req.body;
        
        

        const result = await bookingService.createBooking(payload);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    } catch (error: any) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create booking',
            errors: error
        });
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        const result = await bookingService.getAllBookings(user.id, user.role);

        const message = user.role === 'admin' ? "Bookings retrieved successfully" : "Your bookings retrieved successfully";

        if (!result || result.length === 0) {
            res.status(200).json({
                success: true,
                message: "No bookings found",
                data: []
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: message,
            data: result
        });
    } catch (error: any) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve bookings',
            errors: error
        });
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params as { bookingId: string };
        const { status } = req.body;

        if (!['cancelled', 'returned'].includes(status)) {
            res.status(400).json({
                success: false,
                message: "Invalid status update"
            });
            return;
        }

        const result = await bookingService.updateBooking(bookingId, status);

        
        const message = status === 'returned'
            ? "Booking marked as returned. Vehicle is now available"
            : "Booking cancelled successfully";

        res.status(200).json({
            success: true,
            message: message,
            data: result
        });
    } catch (error: any) {
        console.error('Error updating booking:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update booking',
            errors: error
        });
    }
};

const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
};

export default bookingController;
