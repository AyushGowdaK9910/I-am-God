/**
 * CON-3: Download Controller
 * Optimized for fast downloads (CON-6)
 */

import { Request, Response, NextFunction } from 'express';
import { downloadService } from '../services/downloadService';

export const downloadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      res.status(400).json({
        success: false,
        error: { message: 'fileId is required' },
      });
      return;
    }

    const file = await downloadService.getFile(fileId);

    if (!file) {
      res.status(404).json({
        success: false,
        error: { message: 'File not found' },
      });
      return;
    }

    // Set headers for fast download (CON-6)
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Length', file.size.toString());
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    // Stream file for large files (CON-6: performance)
    const stream = downloadService.createDownloadStream(file.path);
    stream.pipe(res);

    stream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
};

