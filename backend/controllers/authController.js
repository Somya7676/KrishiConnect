import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      role,
    } = req.body

    // Check required fields
    if (!fullName || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      })
    }

    // Validate full name
    if (fullName.trim().length < 2 || fullName.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Full name must contain 2 to 80 characters.',
      })
    }

    // Validate email
    const normalizedEmail = email.trim().toLowerCase()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      })
    }

    // Validate password
    if (
      typeof password !== 'string' ||
      password.length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and at most 72 bytes.',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      })
    }

    // Validate user role
    const allowedRoles = ['farmer', 'buyer', 'seller', 'vendor']

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role.',
      })
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    // Create user (password is hashed by User model)
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role,
    })

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error.message)

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to create account. Please try again.',
    })
  }
}







// Login existing user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // Validate email format
    const normalizedEmail = email.trim().toLowerCase()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // Find user and explicitly include hashed password
    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // Compare entered password with stored hash
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in environment variables.')

      return res.status(500).json({
        success: false,
        message: 'Authentication service is not configured.',
      })
    }

    // Generate authentication token
    const token = jwt.sign(
      { role: user.role },
      process.env.JWT_SECRET,
      {
        subject: user._id.toString(),
        expiresIn: '1d',
        issuer: 'krishiconnect-api',
        audience: 'krishiconnect-client',
      }
    )

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to login. Please try again.',
    })
  }
}







// Get currently logged-in user's profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      '_id fullName email role createdAt'
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'User profile fetched successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Profile fetch error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch user profile.',
    })
  }
}
