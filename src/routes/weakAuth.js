const express = require('express');
const router = express.Router();

// 약한 인증 - 쿠키 기반 인증
router.post('/login', (req, res) => {
  const { username } = req.body;

  // 취약점: 약한 인증 - 비밀번호 확인 없이 쿠키만으로 인증
  res.cookie('user', username, { httpOnly: false });
  res.cookie('role', username === 'admin' ? 'admin' : 'user', { httpOnly: false });

  res.json({
    success: true,
    message: '로그인 성공',
    vulnerability: 'Weak Authentication',
    hint: '쿠키를 수정하여 role을 admin으로 변경해보세요'
  });
});

router.get('/profile', (req, res) => {
  const { user, role } = req.cookies;

  if (!user) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }

  // 취약점: 클라이언트 측에서 수정 가능한 쿠키를 신뢰
  res.json({
    username: user,
    role: role,
    isAdmin: role === 'admin',
    vulnerability: 'Insecure Authentication',
    hint: '쿠키의 role 값을 조작해보세요'
  });
});

module.exports = router;
