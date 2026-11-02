import { uploadProductImages } from '../middleware/uploadMiddleware.js'
import express from 'express'

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController.js'

import {
  protect,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

const router = express.Router()

// Get all products (Public)
router.get('/', getProducts)

// Get logged-in seller's own products
router.get(
  '/my/list',
  protect,
  authorizeRoles('farmer', 'seller', 'vendor'),
  getMyProducts
)




// Get single product (Public)
router.get('/:id', getProductById)

// Create product (Authenticated users)
router.post(
  '/',
  protect,
  authorizeRoles('farmer', 'seller', 'vendor'),
  uploadProductImages,
  createProduct
)

// Update product (Product owner only)
router.put(
  '/:id',
  protect,
  authorizeRoles('farmer', 'seller', 'vendor'),
  updateProduct
)

// Delete product (Product owner only)
router.delete(
  '/:id',
  protect,
  authorizeRoles('farmer', 'seller', 'vendor'),
  deleteProduct
)

export default router
