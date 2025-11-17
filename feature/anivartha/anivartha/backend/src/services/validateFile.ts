/**
 * CON-5: File Validation Service
 * Validates file MIME types and detects corrupted files
 */

import fs from 'fs';
import { File } from 'multer';
import { fileTypeFromFile } from 'file-type';
import mime from 'mime-types';

// Supported MIME types
const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/rtf',
  'text/plain',
  'text/html',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
  'image/svg+xml',
];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  detectedMimeType?: string;
}

export class FileValidationService {
  /**
   * Validate file MIME type (CON-5)
   */
  async validateMimeType(file: File): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check declared MIME type
    if (!SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
      errors.push(`Unsupported MIME type: ${file.mimetype}`);
    }

    // Detect actual file type to prevent spoofing (CON-5)
    if (file.path) {
      try {
        const fileType = await fileTypeFromFile(file.path);
        
        if (fileType) {
          const detectedMime = fileType.mime;
          
          // Verify declared MIME matches detected MIME
          if (file.mimetype !== detectedMime) {
            errors.push(`MIME type mismatch: declared ${file.mimetype}, detected ${detectedMime}`);
          }

          // Check if detected type is supported
          if (!SUPPORTED_MIME_TYPES.includes(detectedMime)) {
            errors.push(`Detected unsupported file type: ${detectedMime}`);
          }

          return {
            isValid: errors.length === 0,
            errors,
            detectedMimeType: detectedMime,
          };
        }
      } catch (error) {
        errors.push(`Failed to detect file type: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if file is corrupted (CON-5)
   */
  async checkFileCorruption(file: File): Promise<ValidationResult> {
    const errors: string[] = [];

    if (!file.path) {
      errors.push('File path not available');
      return { isValid: false, errors };
    }

    try {
      const stats = fs.statSync(file.path);

      // Check file size
      if (stats.size === 0) {
        errors.push('File is empty (corrupted)');
      }

      // Check if file is readable
      fs.accessSync(file.path, fs.constants.R_OK);

      // Try to read first few bytes to check if file is accessible
      const buffer = Buffer.alloc(1024);
      const fd = fs.openSync(file.path, 'r');
      fs.readSync(fd, buffer, 0, 1024, 0);
      fs.closeSync(fd);

      // Basic file structure validation based on magic numbers
      const magicNumber = buffer.toString('hex', 0, 4);
      
      // PDF magic number: %PDF
      if (file.mimetype === 'application/pdf' && !buffer.toString('utf-8', 0, 4).startsWith('%PDF')) {
        errors.push('File does not appear to be a valid PDF');
      }

      // JPEG magic numbers: FF D8 FF
      if (file.mimetype === 'image/jpeg' && magicNumber !== 'ffd8ffe0' && magicNumber !== 'ffd8ffe1') {
        errors.push('File does not appear to be a valid JPEG');
      }

      // PNG magic number: 89 50 4E 47
      if (file.mimetype === 'image/png' && magicNumber !== '89504e47') {
        errors.push('File does not appear to be a valid PNG');
      }

    } catch (error) {
      errors.push(`File corruption check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Complete file validation (CON-5)
   */
  async validateFile(file: File): Promise<ValidationResult> {
    const [mimeResult, corruptionResult] = await Promise.all([
      this.validateMimeType(file),
      this.checkFileCorruption(file),
    ]);

    const allErrors = [...mimeResult.errors, ...corruptionResult.errors];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      detectedMimeType: mimeResult.detectedMimeType,
    };
  }
}

export const fileValidationService = new FileValidationService();

