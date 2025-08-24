import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { isAuth, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/getAllProducts', getAllProducts);
router.get('/getProductById/:id', getProductById);
router.post('/saveProduct', isAuth, isAdmin, upload.single('image'), createProduct);
router.put('/updateProduct/:id', isAuth, isAdmin, upload.single('image'), updateProduct);
router.delete('/deleteProduct/:id', isAuth, isAdmin, deleteProduct);

export default router;
