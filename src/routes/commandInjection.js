const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// Command Injection 취약점
router.get('/ping', (req, res) => {
  const { host } = req.query;

  // 취약점: Command Injection - 사용자 입력을 직접 시스템 명령어에 사용
  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    res.json({
      output: stdout || stderr || error?.message,
      vulnerability: 'Command Injection',
      hint: "127.0.0.1; ls 또는 127.0.0.1 && cat /etc/passwd 를 시도해보세요"
    });
  });
});

module.exports = router;
