import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { beneficiaryQuerySchema, updateBeneficiarySchema } from '../schemas/beneficiary.schema';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { z } from '../utils/zod-openapi';

export const registry = new OpenAPIRegistry();

const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Example of registering auth routes
registry.registerPath({
  method: 'post',
  path: '/auth/register',
  summary: 'Register a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
    },
    400: {
      description: 'Bad request',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  summary: 'Login a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User logged in successfully',
    },
    401: {
      description: 'Unauthorized',
    },
  },
});

// Example of registering beneficiary routes
registry.registerPath({
  method: 'get',
  path: '/beneficiaries',
  summary: 'Get all beneficiaries',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    query: beneficiaryQuerySchema.shape.query,
  },
  responses: {
    200: {
      description: 'List of beneficiaries',
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/beneficiaries/{id}',
  summary: 'Update a beneficiary',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ description: 'Beneficiary ID' }) }),
    body: {
      content: {
        'application/json': {
          schema: updateBeneficiarySchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Beneficiary updated',
    },
  },
});


export function generateOpenAPI() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'NGO API',
      version: '1.0.0',
      description: 'API documentation for the NGO backend',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local development server',
      },
    ],
  });
}
