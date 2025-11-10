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
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import projectRoutes from './routes/project.routes.js';
import contactRoutes from './routes/contact.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import catalogueRoutes from './routes/catalogue.routes.js'

dotenv.config();

const app = express();

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 1. Allow all localhost frontend ports (8080, 5173, etc.)
app.use(cors({
  origin: [
    'http://localhost:5173',       // local dev (Vite)
    'http://localhost:8080',       // local dev (React default)
    'https://hedra-frontend.onrender.com'  // ✅ your Render frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));



// ✅ Static files for PDFs/images in repo
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
console.log('Serving /uploads from:', UPLOADS_DIR, 'exists:', fs.existsSync(UPLOADS_DIR));

app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '7d',
  etag: true,
  // keep CORP permissive so PDFs load when embedded from other origins
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

// (Optional) quick debug endpoint – remove after verifying prod
app.get('/__debug/uploads', (req, res) => {
  fs.promises.readdir(UPLOADS_DIR)
    .then(items => res.json({ ok: true, dir: UPLOADS_DIR, items }))
    .catch(err => res.status(500).json({ ok: false, error: String(err) }));
});

// ✅ Security / logging / body parsers
app.use(helmet({
  // ensure helmet doesn't force same-origin for static assets
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/catalogue',catalogueRoutes)

// ✅ 5. Error handler
app.use(errorHandler);

export default app;