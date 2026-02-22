const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Rick and Morty GraphQL API',
    version: '1.0.0',
    description: 'Documentación Swagger para el endpoint GraphQL y rutas auxiliares',
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_URL || 'http://localhost:4000',
    },
  ],
  paths: {
    '/graphql': {
      post: {
        summary: 'GraphQL endpoint',
        description: 'Envía consultas GraphQL en formato JSON. Body: { query, variables }',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  variables: { type: 'object' },
                },
                required: ['query'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'GraphQL response' },
        },
      },
    },

    // REST-style documentation for common GraphQL operations
    '/characters': {
      get: {
        summary: 'List characters (via GraphQL)',
        description: 'List characters. This documents the GraphQL `characters` query as a REST-like GET endpoint. Use query params or call /graphql with the equivalent query.',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'species', in: 'query', schema: { type: 'string' } },
          { name: 'gender', in: 'query', schema: { type: 'string' } },
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'origin', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } }
        ],
        responses: {
          '200': {
            description: 'Array of Character objects',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Character' } }
              }
            }
          }
        },
        examples: {
          sample: {
            summary: 'Example using query params',
            value: [{ id: 1, name: 'Rick Sanchez' }]
          }
        }
      }
    },

    '/character/{id}': {
      get: {
        summary: 'Get character by id (via GraphQL)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'Character object', content: { 'application/json': { schema: { $ref: '#/components/schemas/Character' } } } },
          '404': { description: 'Not found' }
        }
      }
    },

    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } },
      },
    }
  },
  components: {
    schemas: {
      Character: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          status: { type: 'string' },
          species: { type: 'string' },
          type: { type: 'string' },
          gender: { type: 'string' },
          origin: { type: 'string' },
          image: { type: 'string' },
          url: { type: 'string' }
        }
      }
    }
  }
};

export default swaggerSpec;
