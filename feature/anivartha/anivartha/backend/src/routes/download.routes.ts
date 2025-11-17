import { Router } from 'express';
import { downloadFile } from '../controllers/download';

const router = Router();

/**
 * GET /api/download/:fileId
 * Download file (CON-3)
 */
router.get('/:fileId', downloadFile);

export default router;

