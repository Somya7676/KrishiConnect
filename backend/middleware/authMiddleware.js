
import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Check authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.',
      })
    }

    // Extract token
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'krishiconnect-api',
      audience: 'krishiconnect-client',
    })

    // Attach authenticated user information
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.',
    })
  }
}




// Check whether the logged-in user has the required role
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource.',
      })
    }

    // Check user role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      })
    }

    next()
  }
}
