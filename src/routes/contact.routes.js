import express from 'express';
import { submitContact, getAllMessages } from '../controllers/contact.controller.js';
import { isAuth, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', submitContact); // Contact form
router.get('/', isAuth, isAdmin, getAllMessages); // Admin-only: View all messages

export default router;
