/**
 * CON-3: File Download Service
 * Handles file downloads with streaming for performance
 */

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const tempDir = process.env.TEMP_DIR || './temp';

export interface DownloadFile {
  path: string;
  filename: string;
  mimeType: string;
  size: number;
}

export class DownloadService {
  /**
   * Get file for download (CON-3)
   */
  async getFile(fileId: string): Promise<DownloadFile | null> {
    // Check uploads directory
    const uploadPath = path.join(uploadDir, fileId);
    if (fs.existsSync(uploadPath)) {
      const stats = fs.statSync(uploadPath);
      return {
        path: uploadPath,
        filename: path.basename(uploadPath),
        mimeType: this.getMimeType(uploadPath),
        size: stats.size,
      };
    }

    // Check temp directory (converted files)
    const tempPath = path.join(tempDir, fileId);
    if (fs.existsSync(tempPath)) {
      const stats = fs.statSync(tempPath);
      return {
        path: tempPath,
        filename: path.basename(tempPath),
        mimeType: this.getMimeType(tempPath),
        size: stats.size,
      };
    }

    return null;
  }

  /**
   * Create download stream for large files (CON-6: performance optimization)
   */
  createDownloadStream(filePath: string): Readable {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return fs.createReadStream(filePath);
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.txt': 'text/plain',
      '.html': 'text/html',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}

export const downloadService = new DownloadService();

