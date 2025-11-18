const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // SQL Injection 취약점 - 취약한 로그인
  router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 취약점: SQL Injection - 사용자 입력을 직접 쿼리에 삽입
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        res.json({
          success: true,
          message: '로그인 성공!',
          user: row,
          vulnerability: 'SQL Injection',
          hint: "' OR '1'='1 을 시도해보세요"
        });
      } else {
        res.json({ success: false, message: '로그인 실패' });
      }
    });
  });

  // SQL Injection 취약점 - 사용자 검색
  router.get('/search', (req, res) => {
    const { query: searchQuery } = req.query;

    // 취약점: SQL Injection
    const query = `SELECT id, username, email FROM users WHERE username LIKE '%${searchQuery}%'`;

    db.all(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        results: rows,
        vulnerability: 'SQL Injection',
        hint: "' UNION SELECT id, password, secret_token FROM users-- 를 시도해보세요"
      });
    });
  });

  return router;
};
