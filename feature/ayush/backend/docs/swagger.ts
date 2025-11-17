/**
 * CON-7: Swagger/OpenAPI Documentation Setup
 */

import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Conversion Service API',
      version: '1.0.0',
      description: 'Complete API documentation for the File Conversion Service',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Files',
        description: 'File operations',
      },
      {
        name: 'Conversion',
        description: 'File conversion operations',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupDocs = (app: Express): void => {
  // Swagger UI (CON-7)
  app.use('/api-docs/swagger', swaggerUi.serve);
  app.get('/api-docs/swagger', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'File Conversion API - Swagger',
  }));

  // Redoc UI (CON-7)
  app.get('/api-docs/redoc', redoc({
    title: 'File Conversion Service API',
    specUrl: '/api-docs/swagger.json',
    nonce: '',
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: '#3b82f6',
          },
        },
      },
    },
  }));

  // JSON spec endpoint (CON-7)
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Redirect root docs to Swagger
  app.get('/api-docs', (req, res) => {
    res.redirect('/api-docs/swagger');
  });
};

