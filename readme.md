# Car Rental Management System - Backend Server

**Live URL:** https://b6a2-six.vercel.app

---

## Overview

This project is a **Node.js + Express** backend powered by **PostgreSQL (NeonDB)**.  
It includes secure authentication using **JWT** and a clean, modular structure.

---

## Features

- Fully structured Express backend (controllers, services, routes).
- PostgreSQL database with **Neon serverless platform**.
- **JWT-based authentication** (registration, login, token protection).
- Environment-based configuration.
- Production-ready project folder structure.
- Modern TypeScript setup.

---

## Technology Stack

| Technology      | Purpose                          |
|-----------------|----------------------------------|
| **Node.js**     | Runtime environment              |
| **TypeScript**  | Language for type safety         |
| **Express.js**  | Web framework                    |
| **PostgreSQL**  | Database (via Neon)              |
| **bcrypt**      | Password hashing                 |
| **jsonwebtoken**| JWT authentication               |

---

## Setup & Usage

### 1. Clone the repository:
```bash
git clone https://github.com/mahfujurr/b6a2.git
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Set up environment variables:
Create a `.env` file and add:

```env
PORT=5001
CONNECTION_STRING=postgresql://<USERNAME>:<PASSWORD>@<HOST>/<DBNAME>?sslmode=require&channel_binding=require
JWT_SECRET=<YOUR_SECURE_SECRET>
```

### 4. Run the development server:
```bash
npm run dev
```
