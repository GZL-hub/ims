import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwtUtils.js";
import User, { IUser, RolePermissions, UserRole } from "../models/userModel.js";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      tokenPayload?: TokenPayload;
    }
  }
}

/**
 * Middleware to protect routes - verifies JWT access token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Account is deactivated.",
      });
      return;
    }

    // Attach user and token payload to request
    req.user = user;
    req.tokenPayload = decoded;

    next();
  } catch (error: any) {
    if (error.message === "Invalid or expired access token") {
      res.status(401).json({
        success: false,
        message: "Token expired or invalid. Please refresh your token.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Authentication error.",
      error: error.message,
    });
  }
};

/**
 * Middleware to check if user has specific role(s)
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user has specific permission(s)
 */
export const requirePermission = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const userPermissions = req.user.getPermissions();

    // Check if user has all required permissions
    const hasPermission = permissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required permission(s): ${permissions.join(", ")}`,
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token, but attaches user if valid token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token, continue without user
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select("-password");

    if (user && user.isActive) {
      req.user = user;
      req.tokenPayload = decoded;
    }

    next();
  } catch (error) {
    // Token invalid, but continue without user
    next();
  }
};
