/**
 * CON-1: Upload Controller
 */

import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/uploadService';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
      return;
    }

    const result = await uploadService.handleUpload(req.file);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          message: 'File validation failed',
          errors: result.errors,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        fileId: result.fileId,
        filename: result.filename,
        originalName: result.originalName,
        size: result.size,
        mimeType: result.mimeType,
      },
    });
  } catch (error) {
    next(error);
  }
};

