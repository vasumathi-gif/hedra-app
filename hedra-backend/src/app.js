// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import dotenv from 'dotenv';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { fileURLToPath } from 'url';

// import authRoutes from './routes/auth.routes.js';
// import productRoutes from './routes/product.routes.js';
// import projectRoutes from './routes/project.routes.js';
// import contactRoutes from './routes/contact.routes.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import catalogueRoutes from './routes/catalogue.routes.js'

// dotenv.config();

// const app = express();

// // Allow __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ 1. Allow all localhost frontend ports (8080, 5173, etc.)
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || origin.startsWith('http://localhost')) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

// // ✅ 2. Serve static image files with proper CORS headers
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
//   setHeaders: (res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Or 'http://localhost:8080'
//     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//   }
// }));

// // ✅ 3. General Middleware
// app.use(helmet());
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ 4. API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/catalogue',catalogueRoutes)

// // ✅ 5. Error handler
// app.use(errorHandler);

// export default app;



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

// ✅ 1. Allow all localhost frontend ports (8080, 5173, etc.)
app.use(cors({
  origin: [
    'http://localhost:5173',       // local dev (Vite)
    'http://localhost:3000',       // local dev (React default)
    'https://hedra-frontend.onrender.com'  // ✅ your Render frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// ✅ 2. Serve static image files with proper CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or 'http://localhost:8080'
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// ✅ 3. General Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// ✅ 5. Error handler
app.use(errorHandler);

export default app;