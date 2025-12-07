import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
const config = {
    port: process.env.PORT || 5001,
    connection_string: process.env.CONNECTION_STRING,
    JWT_SECRET: process.env.JWT_SECRET as string
}

if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
}
export default config;
