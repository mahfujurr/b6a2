import { pool } from "../../config/db";
import { IVehicle } from "./vehicle.interface";

const createVehicle = async (payload: IVehicle) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );
    return result.rows[0];
};

const getAllVehicles = async () => {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return result.rows;
};

const getVehicleById = async (id: string) => {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0];
};

const updateVehicle = async (id: string, payload: Partial<IVehicle>) => {
    
    const fields = Object.keys(payload);
    const values = Object.values(payload);

    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    
    
    
    
    const allowed = ['vehicle_name', 'type', 'registration_number', 'daily_rent_price', 'availability_status'];
    const filteredFields: string[] = [];
    const filteredValues: any[] = [];

    fields.forEach((field, i) => {
        if (allowed.includes(field)) {
            filteredFields.push(field);
            filteredValues.push(values[i]);
        }
    });

    if (filteredFields.length === 0) return null;

    const setQuery = filteredFields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const result = await pool.query(
        `UPDATE vehicles SET ${setQuery}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...filteredValues]
    );
    return result.rows[0];
};

const deleteVehicle = async (id: string) => {
    
    
    const activeBookings = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [id]
    );

    if (activeBookings.rows.length > 0) {
        throw new Error('Cannot delete vehicle with active bookings');
    }

    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

const vehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};

export default vehicleService;
