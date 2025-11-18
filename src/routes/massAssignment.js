const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Mass Assignment 취약점
  router.put('/update-profile', (req, res) => {
    const userId = req.query.userId || 1;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.json({
        error: 'No fields to update',
        example: { username: 'newname', role: 'admin' }
      });
    }

    // 취약점: Mass Assignment - 모든 필드를 무조건 업데이트
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), userId];

    db.run(`UPDATE users SET ${fields} WHERE id = ?`, values, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // 업데이트된 사용자 정보 조회
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          success: true,
          message: `${this.changes} row(s) updated`,
          updatedUser: row,
          vulnerability: 'Mass Assignment',
          hint: '{"role": "admin", "secret_token": "my_token"} 같은 민감한 필드를 업데이트해보세요'
        });
      });
    });
  });

  return router;
};
