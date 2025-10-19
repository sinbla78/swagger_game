const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

// Swagger 문서 정의
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '게임 API',
    version: '1.0.0',
    description: '간단한 게임 API 예제입니다',
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api`,
      description: '개발 서버',
    },
  ],
  paths: {
    '/users': {
      get: {
        summary: '모든 유저 조회',
        description: '시스템의 모든 유저를 조회합니다',
        tags: ['Users'],
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: '유저 생성',
        description: '새로운 유저를 생성합니다',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: '생성됨',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
    },
    '/users/{userId}': {
      get: {
        summary: '특정 유저 조회',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: '유저 ID',
          },
        ],
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '404': {
            description: '유저를 찾을 수 없음',
          },
        },
      },
      put: {
        summary: '유저 정보 수정',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '수정됨',
          },
        },
      },
      delete: {
        summary: '유저 삭제',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        responses: {
          '204': {
            description: '삭제됨',
          },
        },
      },
    },
    '/games': {
      get: {
        summary: '모든 게임 조회',
        tags: ['Games'],
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Game',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/games/{gameId}/start': {
      post: {
        summary: '게임 시작',
        tags: ['Games'],
        parameters: [
          {
            name: 'gameId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        responses: {
          '200': {
            description: '게임 시작됨',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: '게임이 시작되었습니다',
                    },
                    gameId: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/games/{gameId}/score': {
      post: {
        summary: '점수 기록',
        tags: ['Games'],
        parameters: [
          {
            name: 'gameId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'integer',
                  },
                  score: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: '점수 기록됨',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          username: {
            type: 'string',
            example: 'player123',
          },
          email: {
            type: 'string',
            example: 'player@example.com',
          },
          level: {
            type: 'integer',
            example: 5,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      UserInput: {
        type: 'object',
        required: ['username', 'email'],
        properties: {
          username: {
            type: 'string',
            example: 'newplayer',
          },
          email: {
            type: 'string',
            example: 'newplayer@example.com',
          },
        },
      },
      Game: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          title: {
            type: 'string',
            example: '슈퍼 어드벤처',
          },
          genre: {
            type: 'string',
            example: 'RPG',
          },
          players: {
            type: 'integer',
            example: 100,
          },
          maxPlayers: {
            type: 'integer',
            example: 1000,
          },
        },
      },
    },
  },
};

// JSON 파싱 미들웨어
app.use(express.json());

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 간단한 API 엔드포인트 예제
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, username: 'player1', email: 'player1@example.com', level: 5 },
    { id: 2, username: 'player2', email: 'player2@example.com', level: 3 },
  ]);
});

app.get('/api/games', (req, res) => {
  res.json([
    { id: 1, title: '슈퍼 어드벤처', genre: 'RPG', players: 100, maxPlayers: 1000 },
    { id: 2, title: '레이싱 챔피언', genre: 'Racing', players: 50, maxPlayers: 500 },
  ]);
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Swagger Game API</h1>
    <p>API 문서를 보려면 <a href="/api-docs">/api-docs</a>를 방문하세요</p>
  `);
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
