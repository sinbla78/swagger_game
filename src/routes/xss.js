const express = require('express');
const router = express.Router();

// XSS (Cross-Site Scripting) 취약점
router.get('/comment', (req, res) => {
  const { text } = req.query;

  // 취약점: XSS - 사용자 입력을 필터링 없이 HTML에 출력
  res.send(`
    <html>
      <head>
        <title>댓글 게시판</title>
        <style>
          body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
          .comment { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .warning { color: red; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>댓글 게시판</h1>
        <div class="comment">
          <p><strong>댓글:</strong> ${text}</p>
        </div>
        <p class="warning">취약점: XSS (Reflected)</p>
        <p>힌트: &lt;script&gt;alert('XSS')&lt;/script&gt; 를 시도해보세요</p>
        <hr>
        <a href="/">홈으로</a>
      </body>
    </html>
  `);
});

module.exports = router;
