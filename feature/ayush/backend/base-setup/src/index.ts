/**
 * CON-17: Backend Setup - Main Entry Point
 * Node.js + TypeScript Express server
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { setupDocs } from '../docs/swagger';
import { setupHealthChecks } from '../health/health-check-controller';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Setup API documentation (CON-7)
setupDocs(app);

// Setup health checks (CON-9)
setupHealthChecks(app);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'File Conversion Service API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});

export default app;

