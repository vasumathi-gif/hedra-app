


import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import projectRoutes from './routes/project.routes.js';
import contactRoutes from './routes/contact.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration - allow specific origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hedra-frontend.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors());

// Serve static files with CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// General middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Error handler middleware (make sure errorHandler is properly implemented)
app.use(errorHandler);

export default app;
