import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { beneficiaryQuerySchema, updateBeneficiarySchema } from '../schemas/beneficiary.schema';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { volunteerQuerySchema, updateVolunteerSchema } from '../schemas/volunteer.schema';
import { eventQuerySchema, createEventSchema, updateEventSchema, registerEventSchema } from '../schemas/event.schema';
import { projectQuerySchema, createProjectSchema, updateProjectSchema, assignVolunteerSchema, assignBeneficiarySchema } from '../schemas/project.schema';
import { donationQuerySchema, createDonationSchema, updateDonationStatusSchema } from '../schemas/donation.schema';
import { markAttendanceSchema } from '../schemas/attendance.schema';
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
// --- VOLUNTEERS ---
registry.registerPath({
  method: 'get',
  path: '/volunteers',
  summary: 'Get all volunteers',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: volunteerQuerySchema.shape.query },
  responses: { 200: { description: 'List of volunteers' } },
});
registry.registerPath({
  method: 'get',
  path: '/volunteers/{id}',
  summary: 'Get volunteer by ID',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Volunteer ID' }) }) },
  responses: { 200: { description: 'Volunteer details' } },
});
registry.registerPath({
  method: 'put',
  path: '/volunteers/{id}',
  summary: 'Update volunteer',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Volunteer ID' }) }), body: { content: { 'application/json': { schema: updateVolunteerSchema.shape.body } } } },
  responses: { 200: { description: 'Volunteer updated' } },
});
registry.registerPath({
  method: 'delete',
  path: '/volunteers/{id}',
  summary: 'Deactivate volunteer',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Volunteer ID' }) }) },
  responses: { 204: { description: 'Volunteer deactivated' } },
});

// --- EVENTS ---
registry.registerPath({
  method: 'post',
  path: '/events',
  summary: 'Create an event',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createEventSchema.shape.body } } } },
  responses: { 201: { description: 'Event created' } },
});
registry.registerPath({
  method: 'get',
  path: '/events',
  summary: 'Get all events',
  request: { query: eventQuerySchema.shape.query },
  responses: { 200: { description: 'List of events' } },
});
registry.registerPath({
  method: 'get',
  path: '/events/{id}',
  summary: 'Get event by ID',
  request: { params: z.object({ id: z.string().openapi({ description: 'Event ID' }) }) },
  responses: { 200: { description: 'Event details' } },
});
registry.registerPath({
  method: 'put',
  path: '/events/{id}',
  summary: 'Update event',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Event ID' }) }), body: { content: { 'application/json': { schema: updateEventSchema.shape.body } } } },
  responses: { 200: { description: 'Event updated' } },
});
registry.registerPath({
  method: 'post',
  path: '/events/{id}/register',
  summary: 'Register for event',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Event ID' }) }) },
  responses: { 200: { description: 'Registered for event' } },
});
registry.registerPath({
  method: 'post',
  path: '/events/{id}/cancel',
  summary: 'Cancel registration',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Event ID' }) }) },
  responses: { 200: { description: 'Registration cancelled' } },
});

// --- PROJECTS ---
registry.registerPath({
  method: 'post',
  path: '/projects',
  summary: 'Create project',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createProjectSchema.shape.body } } } },
  responses: { 201: { description: 'Project created' } },
});
registry.registerPath({
  method: 'get',
  path: '/projects',
  summary: 'Get all projects',
  request: { query: projectQuerySchema.shape.query },
  responses: { 200: { description: 'List of projects' } },
});
registry.registerPath({
  method: 'get',
  path: '/projects/{id}',
  summary: 'Get project by ID',
  request: { params: z.object({ id: z.string().openapi({ description: 'Project ID' }) }) },
  responses: { 200: { description: 'Project details' } },
});
registry.registerPath({
  method: 'put',
  path: '/projects/{id}',
  summary: 'Update project',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Project ID' }) }), body: { content: { 'application/json': { schema: updateProjectSchema.shape.body } } } },
  responses: { 200: { description: 'Project updated' } },
});
registry.registerPath({
  method: 'post',
  path: '/projects/{id}/assign-volunteer',
  summary: 'Assign volunteer to project',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Project ID' }) }), body: { content: { 'application/json': { schema: assignVolunteerSchema.shape.body } } } },
  responses: { 200: { description: 'Volunteer assigned' } },
});
registry.registerPath({
  method: 'post',
  path: '/projects/{id}/assign-beneficiary',
  summary: 'Assign beneficiary to project',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Project ID' }) }), body: { content: { 'application/json': { schema: assignBeneficiarySchema.shape.body } } } },
  responses: { 200: { description: 'Beneficiary assigned' } },
});

// --- DONATIONS ---
registry.registerPath({
  method: 'post',
  path: '/donations',
  summary: 'Create donation',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createDonationSchema.shape.body } } } },
  responses: { 201: { description: 'Donation created' } },
});
registry.registerPath({
  method: 'get',
  path: '/donations',
  summary: 'Get all donations',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: donationQuerySchema.shape.query },
  responses: { 200: { description: 'List of donations' } },
});
registry.registerPath({
  method: 'get',
  path: '/donations/{id}',
  summary: 'Get donation by ID',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Donation ID' }) }) },
  responses: { 200: { description: 'Donation details' } },
});
registry.registerPath({
  method: 'put',
  path: '/donations/{id}',
  summary: 'Update donation status',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Donation ID' }) }), body: { content: { 'application/json': { schema: updateDonationStatusSchema.shape.body } } } },
  responses: { 200: { description: 'Donation updated' } },
});

// --- NOTIFICATIONS ---
registry.registerPath({
  method: 'get',
  path: '/notifications',
  summary: 'Get all notifications',
  security: [{ [bearerAuth.name]: [] }],
  responses: { 200: { description: 'List of notifications' } },
});
registry.registerPath({
  method: 'patch',
  path: '/notifications/{id}/read',
  summary: 'Mark notification as read',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().openapi({ description: 'Notification ID' }) }) },
  responses: { 200: { description: 'Notification marked as read' } },
});

// --- ATTENDANCE ---
registry.registerPath({
  method: 'patch',
  path: '/attendance/{registrationId}',
  summary: 'Mark attendance',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ registrationId: z.string().openapi({ description: 'Registration ID' }) }), body: { content: { 'application/json': { schema: markAttendanceSchema.shape.body } } } },
  responses: { 200: { description: 'Attendance marked' } },
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
