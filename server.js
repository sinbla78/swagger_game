const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');

// 설정 및 데이터베이스
const swaggerDocument = require('./src/config/swagger');
const initDatabase = require('./src/database/init');

// 라우터
const sqlInjectionRoutes = require('./src/routes/sqlInjection');
const xssRoutes = require('./src/routes/xss');
const commandInjectionRoutes = require('./src/routes/commandInjection');
const pathTraversalRoutes = require('./src/routes/pathTraversal');
const idorRoutes = require('./src/routes/idor');
const weakAuthRoutes = require('./src/routes/weakAuth');
const dataExposureRoutes = require('./src/routes/dataExposure');
const ssrfRoutes = require('./src/routes/ssrf');
const massAssignmentRoutes = require('./src/routes/massAssignment');

const app = express();
const PORT = 3000;

// 데이터베이스 초기화
const db = initDatabase();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================================
// 일반 API 엔드포인트
// ========================================

app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, email FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/games', (req, res) => {
  db.all('SELECT * FROM games', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ========================================
// 취약점 라우터 설정
// ========================================

app.use('/api/vulnerable', sqlInjectionRoutes(db));
app.use('/api/vulnerable', xssRoutes);
app.use('/api/vulnerable', commandInjectionRoutes);
app.use('/api/vulnerable', pathTraversalRoutes);
app.use('/api/vulnerable', idorRoutes(db));
app.use('/api/vulnerable/auth', weakAuthRoutes);
app.use('/api/vulnerable', dataExposureRoutes);
app.use('/api/vulnerable', ssrfRoutes);
app.use('/api/vulnerable', massAssignmentRoutes(db));

// ========================================
// 메인 페이지
// ========================================

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>보안 취약점 학습 서버</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .container {
            background: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          }
          h1 {
            color: #d32f2f;
            font-size: 2.5em;
            margin-bottom: 10px;
          }
          .vulnerability {
            background: #fff3e0;
            padding: 20px;
            margin: 15px 0;
            border-left: 5px solid #ff9800;
            border-radius: 5px;
            transition: transform 0.2s;
          }
          .vulnerability:hover {
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .vulnerability h3 {
            margin-top: 0;
            color: #e65100;
          }
          code {
            background: #f5f5f5;
            padding: 3px 8px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #c7254e;
          }
          .warning {
            background: #ffebee;
            padding: 20px;
            border-left: 5px solid #d32f2f;
            margin: 20px 0;
            border-radius: 5px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 10px 10px 0;
            transition: background 0.3s;
          }
          .btn:hover {
            background: #5568d3;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
          }
          .stat-card h2 {
            margin: 0;
            font-size: 3em;
          }
          .stat-card p {
            margin: 10px 0 0 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔒 보안 취약점 학습 서버</h1>

          <div class="warning">
            <strong>⚠️ 경고:</strong> 이 서버는 교육 목적으로만 사용됩니다.
            실제 프로덕션 환경에서는 절대 이러한 취약점을 포함해서는 안 됩니다!
          </div>

          <div style="margin: 30px 0;">
            <a href="/api-docs" class="btn">📚 Swagger API 문서</a>
            <a href="https://owasp.org/www-project-top-ten/" target="_blank" class="btn">🔗 OWASP Top 10</a>
          </div>

          <div class="stats">
            <div class="stat-card">
              <h2>9</h2>
              <p>취약점 종류</p>
            </div>
            <div class="stat-card">
              <h2>15+</h2>
              <p>테스트 엔드포인트</p>
            </div>
            <div class="stat-card">
              <h2>100%</h2>
              <p>실습 가능</p>
            </div>
          </div>

          <h2>📋 포함된 취약점들</h2>

          <div class="vulnerability">
            <h3>1. SQL Injection 💉</h3>
            <p><code>POST /api/vulnerable/login</code> - 취약한 로그인</p>
            <p><code>GET /api/vulnerable/search?query=</code> - 사용자 검색</p>
            <p><strong>힌트:</strong> <code>' OR '1'='1</code> 또는 <code>' UNION SELECT ...</code></p>
          </div>

          <div class="vulnerability">
            <h3>2. XSS (Cross-Site Scripting) 🎭</h3>
            <p><code>GET /api/vulnerable/comment?text=</code></p>
            <p><strong>힌트:</strong> <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code></p>
          </div>

          <div class="vulnerability">
            <h3>3. Command Injection 💻</h3>
            <p><code>GET /api/vulnerable/ping?host=</code></p>
            <p><strong>힌트:</strong> <code>127.0.0.1; ls</code> 또는 <code>127.0.0.1 && whoami</code></p>
          </div>

          <div class="vulnerability">
            <h3>4. Path Traversal 📁</h3>
            <p><code>GET /api/vulnerable/file?filename=</code></p>
            <p><strong>힌트:</strong> <code>../server.js</code> 또는 <code>../../package.json</code></p>
          </div>

          <div class="vulnerability">
            <h3>5. IDOR (Insecure Direct Object Reference) 🔓</h3>
            <p><code>GET /api/vulnerable/user/:id</code></p>
            <p><strong>힌트:</strong> 다른 사용자의 ID로 접근 (1, 2, 3, 4)</p>
          </div>

          <div class="vulnerability">
            <h3>6. 약한 인증 (Weak Authentication) 🍪</h3>
            <p><code>POST /api/vulnerable/auth/login</code></p>
            <p><code>GET /api/vulnerable/auth/profile</code></p>
            <p><strong>힌트:</strong> 쿠키의 role 값을 조작</p>
          </div>

          <div class="vulnerability">
            <h3>7. 민감한 정보 노출 🔑</h3>
            <p><code>GET /api/vulnerable/debug</code></p>
            <p>데이터베이스 비밀번호, API 키 등이 노출됩니다</p>
          </div>

          <div class="vulnerability">
            <h3>8. SSRF (Server-Side Request Forgery) 🌐</h3>
            <p><code>GET /api/vulnerable/proxy?url=</code></p>
            <p><strong>힌트:</strong> <code>http://localhost:3000/api/vulnerable/debug</code></p>
          </div>

          <div class="vulnerability">
            <h3>9. Mass Assignment ✏️</h3>
            <p><code>PUT /api/vulnerable/update-profile?userId=1</code></p>
            <p><strong>힌트:</strong> role이나 secret_token 같은 민감한 필드 업데이트 시도</p>
          </div>

          <h2>🎓 학습 방법</h2>
          <ol>
            <li><strong>Swagger 문서 확인:</strong> <a href="/api-docs">/api-docs</a>에서 모든 엔드포인트를 확인하세요</li>
            <li><strong>취약점 테스트:</strong> Postman, curl, 또는 브라우저로 각 엔드포인트를 테스트하세요</li>
            <li><strong>공격 시도:</strong> 제공된 힌트를 참고하여 취약점을 악용해보세요</li>
            <li><strong>방어 학습:</strong> 각 취약점이 어떻게 방어되어야 하는지 학습하세요</li>
          </ol>

          <h2>📖 추천 학습 자료</h2>
          <ul>
            <li><a href="https://owasp.org/www-project-top-ten/" target="_blank">OWASP Top 10</a></li>
            <li><a href="https://portswigger.net/web-security" target="_blank">PortSwigger Web Security Academy</a></li>
            <li><a href="https://www.hacksplaining.com/" target="_blank">Hacksplaining</a></li>
          </ul>

          <hr style="margin: 40px 0;">
          <p style="color: #666; text-align: center;">
            <strong>면책 조항:</strong> 이 도구는 교육 목적으로만 사용해야 합니다.
            승인 없이 타인의 시스템을 테스트하는 것은 불법입니다.
          </p>
        </div>
      </body>
    </html>
  `);
});

// ========================================
// 서버 시작
// ========================================

app.listen(PORT, () => {
  console.log('========================================');
  console.log('🔒 보안 취약점 학습 서버');
  console.log('========================================');
  console.log(`🌐 서버: http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log('========================================');
  console.log('⚠️  경고: 교육 목적으로만 사용하세요!');
  console.log('========================================\n');
});
