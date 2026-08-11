# HopeBridge NGO Platform

This repository contains the backend service for the HopeBridge NGO platform, built with Node.js, Express, TypeScript, and Prisma (PostgreSQL).

## Project Structure
- `backend/`: Contains the Node.js API, Prisma schema, and server configuration.
- *(Future frontend directories can be placed at the root alongside `backend/`)*

---

## Local Setup Guide

If you are a collaborator pulling this repository for the first time, follow these steps to get the project running on your local machine.

### Prerequisites
1. **Node.js**: Ensure you have Node.js (v18+ recommended) installed.
2. **PostgreSQL**: Ensure you have a local PostgreSQL server running, or a cloud database URL ready.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd NGO_project
```

### 2. Install Backend Dependencies
Navigate into the backend directory and install the required npm packages.
```bash
cd backend
npm install
```

### 3. Environment Variables Configuration
Because `.env` files contain sensitive secrets, they are ignored by Git. You must create one manually:
1. In the `backend/` folder, copy the example file:
   - On Windows: `copy .env.example .env`
   - On Mac/Linux: `cp .env.example .env`
2. Open the new `.env` file and fill in your local configurations. Pay special attention to the `DATABASE_URL` and `JWT_SECRET`.
   - Example Database URL: `postgresql://postgres:yourpassword@localhost:5432/ngo_db?schema=public`

### 4. Database Setup (Prisma)
With your database running and your `.env` configured, run Prisma to apply migrations (create the tables) and generate the TypeScript client.
```bash
npx prisma migrate dev
```
*(If you just want to push the schema without tracking migration history, you can use `npx prisma db push` instead).*

### 5. Start the Development Server
Run the following command to start the server in watch mode (it will automatically restart when you make file changes).
```bash
npm run dev
```

The server should now be running (usually on `http://localhost:5000` or whatever port is defined in your `.env`).