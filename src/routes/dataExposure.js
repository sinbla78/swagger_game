const express = require('express');
const router = express.Router();

// 민감한 정보 노출
router.get('/debug', (req, res) => {
  // 취약점: 민감한 정보 노출
  res.json({
    environment: process.env,
    databaseConfig: {
      host: 'localhost',
      user: 'root',
      password: 'supersecretpassword123',
      database: 'gamedb'
    },
    apiKeys: {
      stripe: 'sk_test_51abc123xyz',
      aws: 'AKIAIOSFODNN7EXAMPLE',
      jwt_secret: 'my_super_secret_jwt_key_12345'
    },
    internalPaths: {
      configFile: '/etc/app/config.json',
      logFile: '/var/log/app.log',
      backupDir: '/backup/database/'
    },
    vulnerability: 'Sensitive Data Exposure',
    hint: '프로덕션 환경에서는 절대 이런 정보를 노출하면 안됩니다!'
  });
});

module.exports = router;
