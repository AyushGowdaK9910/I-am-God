/**
 * CON-1: File Upload Service
 * Handles file uploads with validation
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Express } from 'express';
import { fileValidationService } from './validateFile';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB default
  },
});

export interface UploadResult {
  success: boolean;
  fileId: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  errors?: string[];
}

export class UploadService {
  /**
   * Handle file upload (CON-1)
   */
  async handleUpload(file: Express.Multer.File): Promise<UploadResult> {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file (CON-5)
    const validation = await fileValidationService.validateFile(file);

    if (!validation.isValid) {
      // Delete invalid file
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        success: false,
        fileId: '',
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        path: file.path,
        errors: validation.errors,
      };
    }

    // Generate file ID
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      fileId,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      path: file.path,
    };
  }
}

export const uploadService = new UploadService();

