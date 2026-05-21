# Field Force Management System (FFMS) - Frontend

This is the frontend application for the Field Force Management System (FFMS). It is a modern React application built with Vite.

## Live Links

- **Frontend:** [https://sapio-frontend.vercel.app/](https://sapio-frontend.vercel.app/)
- **Backend API:** [https://sapio.onrender.com](https://sapio.onrender.com)

## Running Locally

To run the frontend application on your local machine, follow these steps:

### 1. Install Dependencies

Make sure you have Node.js installed, then run:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and specify the backend API URL. 

To connect to your local backend server, use:
```env
VITE_API_URL=http://localhost:8000
```

*(If you want to connect to the live production backend instead, use `VITE_API_URL=https://sapio.onrender.com`)*

### 3. Start the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled static assets ready for deployment.
