const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // IDOR (Insecure Direct Object Reference) 취약점
  router.get('/user/:id', (req, res) => {
    const { id } = req.params;

    // 취약점: IDOR - 권한 검증 없이 모든 사용자 정보 조회 가능
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        user: row,
        vulnerability: 'IDOR (Insecure Direct Object Reference)',
        hint: '다른 사용자의 ID로 접근해보세요 (1, 2, 3)'
      });
    });
  });

  return router;
};
