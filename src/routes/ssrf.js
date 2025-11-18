const express = require('express');
const router = express.Router();

// SSRF (Server-Side Request Forgery) 취약점
router.get('/proxy', (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.json({
      error: 'URL parameter is required',
      example: '/api/vulnerable/proxy?url=http://example.com'
    });
  }

  // 취약점: SSRF - URL 검증 없이 요청
  const https = require('https');
  const http = require('http');

  const client = url.startsWith('https') ? https : http;

  client.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      res.json({
        statusCode: response.statusCode,
        headers: response.headers,
        data: data.substring(0, 1000), // 첫 1000자만 표시
        vulnerability: 'SSRF (Server-Side Request Forgery)',
        hint: 'http://localhost:3000/api/vulnerable/debug 를 시도해보세요'
      });
    });
  }).on('error', (err) => {
    res.json({
      error: err.message,
      vulnerability: 'SSRF',
      hint: '내부 서비스에 접근을 시도해보세요'
    });
  });
});

module.exports = router;
