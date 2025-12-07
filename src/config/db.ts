import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.connection_string
});

const InitDB = async () => {
    try {
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(250) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone VARCHAR(50) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer'))
            )
        `);

        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id SERIAL PRIMARY KEY,
                vehicle_name VARCHAR(250) NOT NULL,
                type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
                registration_number VARCHAR(100) UNIQUE NOT NULL,
                daily_rent_price DECIMAL NOT NULL CHECK (daily_rent_price > 0),
                availability_status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked'))
            )
        `);

        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
                rent_start_date DATE NOT NULL,
                rent_end_date DATE NOT NULL,
                total_price DECIMAL NOT NULL CHECK (total_price > 0),
                status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned'))
            )
        `);

       
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}
export default InitDB;