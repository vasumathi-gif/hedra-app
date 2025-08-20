import express from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register); // Remove after first admin created
router.post('/login', login);

export default router;
