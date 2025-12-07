import { pool } from "../../config/db";
import { IBooking } from "./booking.interface";

const createBooking = async (payload: IBooking) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

        const vehicleResult = await client.query(
            "SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'",
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            throw new Error('Vehicle is not available');
        }

        const vehicle = vehicleResult.rows[0];

        const startDate = new Date(rent_start_date);
        const endDate = new Date(rent_end_date);
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

        if (duration <= 0) {
            throw new Error('End date must be after start date');
        }

        const total_price = duration * parseFloat(vehicle.daily_rent_price);

        const bookingResult = await client.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
             VALUES ($1, $2, $3, $4, $5, 'active') 
             RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
        );

        await client.query(
            "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
            [vehicle_id]
        );

        await client.query('COMMIT');

        const booking = bookingResult.rows[0];
        return {
            ...booking,
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price
            }
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getAllBookings = async (userId: number, role: string) => {
    let query = `
        SELECT 
            b.*, 
            v.vehicle_name, v.registration_number, v.type,
            u.name as customer_name, u.email as customer_email
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON b.customer_id = u.id
    `;

    const params: any[] = [];

    if (role === 'customer') {
        query += ` WHERE b.customer_id = $1`;
        params.push(userId);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);

    return result.rows.map(row => {
        const { vehicle_name, registration_number, type, customer_name, customer_email, ...booking } = row;

        const response: any = { ...booking };
        response.vehicle = { vehicle_name, registration_number, type };

        if (role === 'admin') {
            response.customer = { name: customer_name, email: customer_email };
        }

        return response;
    });
};

const updateBooking = async (bookingId: string, status: string) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const bookingResult = await client.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
        if (bookingResult.rows.length === 0) {
            throw new Error('Booking not found');
        }
        const booking = bookingResult.rows[0];

        if (status === 'cancelled' && booking.status !== 'active') {
        }

        const result = await client.query(
            `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, bookingId]
        );

        if (status === 'returned' || status === 'cancelled') {
            await client.query(
                "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
                [booking.vehicle_id]
            );
        }

        await client.query('COMMIT');

        const updatedBooking = result.rows[0];
        const vehicleResult = await pool.query('SELECT * FROM vehicles WHERE id = $1', [updatedBooking.vehicle_id]);

        return {
            ...updatedBooking,
            vehicle: vehicleResult.rows[0]
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const bookingService = {
    createBooking,
    getAllBookings,
    updateBooking
};

export default bookingService;
