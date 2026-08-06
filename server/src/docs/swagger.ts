export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'QuizArena — Gamified Quiz & Online Assessment Platform API',
    version: '1.0.0',
    description:
      'Production-ready REST API for quiz management, assessment execution, scoring, gamification engine (XP, levels, badges, streaks), and leaderboards.',
    contact: {
      name: 'QuizArena Engineering Team',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API Version 1',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT Access Token',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['ADMIN', 'STUDENT'] },
          xp: { type: 'integer' },
          level: { type: 'integer' },
          streak: { type: 'integer' },
        },
      },
      Quiz: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] },
          timeLimitSeconds: { type: 'integer' },
          passingScore: { type: 'integer' },
          thumbnail: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
        },
      },
      Attempt: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          quizId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          score: { type: 'integer' },
          totalPoints: { type: 'integer' },
          percentage: { type: 'number' },
          passed: { type: 'boolean' },
          xpEarned: { type: 'integer' },
          status: { type: 'string', enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'] },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new student or admin account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alex Student' },
                  email: { type: 'string', example: 'alex@example.com' },
                  password: { type: 'string', example: 'Student123!' },
                  role: { type: 'string', enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created successfully' },
          '400': { description: 'Validation error or email already in use' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Log in with credentials and receive JWT access token & httpOnly refresh cookie',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'student@quizplatform.com' },
                  password: { type: 'string', example: 'Student123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid email or password' },
        },
      },
    },
    '/quizzes': {
      get: {
        tags: ['Quizzes'],
        summary: 'Get all published quizzes with optional category search',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of available published quizzes' },
        },
      },
    },
    '/quizzes/{id}': {
      get: {
        tags: ['Quizzes'],
        summary: 'Get published quiz details and questions by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Quiz details and question payload' },
          '404': { description: 'Quiz not found' },
        },
      },
    },
    '/attempts/start': {
      post: {
        tags: ['Assessment Engine'],
        security: [{ bearerAuth: [] }],
        summary: 'Start or resume a timed quiz attempt',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quizId'],
                properties: {
                  quizId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'New attempt initialized' },
          '200': { description: 'Existing active attempt resumed' },
        },
      },
    },
    '/attempts/{id}/finalize': {
      post: {
        tags: ['Assessment Engine'],
        security: [{ bearerAuth: [] }],
        summary: 'Grade and finalize a quiz attempt (Idempotent)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Attempt scored, XP awarded, and badges evaluated' },
        },
      },
    },
    '/leaderboard/global': {
      get: {
        tags: ['Leaderboard'],
        summary: 'Get top XP global user rankings',
        responses: {
          '200': { description: 'Global XP leaderboard podium' },
        },
      },
    },
  },
};
