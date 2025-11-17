/**
 * CON-1, CON-3, CON-5, CON-6: Main Server
 */

import express, { Express } from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload.routes';
import downloadRoutes from './routes/download.routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'anivartha-upload-download' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

