import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getBestSellers,
  getChairProducts
} from '../controllers/product.controller.js';
import { isAuth, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/getAllProducts', getAllProducts);
router.get('/getProductById/:id', getProductById);
router.post(
  "/saveProduct",
  isAuth,
  isAdmin,
  upload.array("images", 8), // <— multiple files under field name "images"
  createProduct
);
// e.g. routes/products.js
router.put(
  '/updateProduct/:id',
  upload.fields([{ name: 'newImages', maxCount: 10 }]), // or upload.array('newImages')
  updateProduct
);

router.delete('/deleteProduct/:id', isAuth, isAdmin, deleteProduct);
router.get("/getProductsByCategory/:category", getProductsByCategory);
router.get("/getchairs", getChairProducts);
router.get("/best-sellers", getBestSellers);

export default router;
