import { Router } from 'express';
import { uploadFile } from '../controllers/upload';
import { upload } from '../services/uploadService';
import { validateUpload } from '../middleware/uploadValidation';

const router = Router();

/**
 * POST /api/upload
 * Upload file (CON-1)
 */
router.post('/', upload.single('file'), validateUpload, uploadFile);

export default router;

