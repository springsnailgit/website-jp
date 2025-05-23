import express from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, getProductStats, updateProduct } from '../controllers/product.controller';
import { authorize, protect } from '../middleware/auth';
import { uploadProductImages } from '../middleware/upload';

const router = express.Router();

// 统计路由 - 必须在 /:id 路由之前
router.get('/stats', getProductStats);

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), uploadProductImages, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), uploadProductImages, updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;
