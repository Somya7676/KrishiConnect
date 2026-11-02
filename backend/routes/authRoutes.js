
import express from 'express'

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../controllers/authController.js'

import {
  protect,
  authorizeRoles,
} from '../middleware/authMiddleware.js'

const router = express.Router()

// Registration API
router.post('/register', registerUser)

// Login API
router.post('/login', loginUser)

// Protected profile API
router.get('/me', protect, getCurrentUser)


 // Seller-only protected route
router.get(
  '/seller-access',
  protect,
  authorizeRoles('seller'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Seller access granted successfully.',
      user: req.user,
    })
  }
)


export default router
