const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path Traversal 취약점
router.get('/file', (req, res) => {
  const { filename } = req.query;

  // 취약점: Path Traversal - 파일 경로 검증 없음
  const filePath = path.join(__dirname, '../../uploads', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.json({
        error: err.message,
        vulnerability: 'Path Traversal',
        hint: '../server.js 또는 ../../package.json 를 시도해보세요'
      });
    }
    res.json({
      content: data,
      vulnerability: 'Path Traversal',
      message: '파일을 성공적으로 읽었습니다!'
    });
  });
});

module.exports = router;
