import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';

import { isAuth, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', isAuth, isAdmin, upload.single('image'), createProject);
router.put('/:id', isAuth, isAdmin, upload.single('image'), updateProject);
router.delete('/:id', isAuth, isAdmin, deleteProject);

export default router;
