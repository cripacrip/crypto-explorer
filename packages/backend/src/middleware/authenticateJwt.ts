import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface JwtPayload {
  id: number;
  email: string;
  username: string;
}

/**
 * Middleware to authenticate JWT tokens
 * Extracts token from Authorization header: "Bearer <token>"
 * Verifies token and attaches user info to req.user
 */
export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Attach user info to request
    (req as any).user = {
      userId: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    // Continue to next middleware/route handler
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

/**
 * Optional JWT authentication - doesn't fail if no token
 * Useful for routes that work differently for authenticated users
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as any).user = {
      userId: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    return next();
  } catch (error) {
    // If token is invalid, just continue without user info
    return next();
  }
};
