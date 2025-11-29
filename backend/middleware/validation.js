import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {object} - Error response if validation fails
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error) => ({
        field: error.path || error.param,
        message: error.msg,
      })),
    });
  }
  
  next();
};

