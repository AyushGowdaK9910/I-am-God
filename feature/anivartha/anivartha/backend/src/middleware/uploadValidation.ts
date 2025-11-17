/**
 * CON-5: Upload Validation Middleware
 * Validates files before processing
 */

import { Request, Response, NextFunction } from 'express';
import { fileValidationService } from '../services/validateFile';

export const validateUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: { message: 'No file provided' },
      });
      return;
    }

    // Validate file (CON-5)
    const validation = await fileValidationService.validateFile(req.file);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: {
          message: 'File validation failed',
          errors: validation.errors,
        },
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

