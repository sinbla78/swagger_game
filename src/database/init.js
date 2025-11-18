const sqlite3 = require('sqlite3').verbose();

function initDatabase() {
  // SQLite 데이터베이스 초기화 (메모리 기반)
  const db = new sqlite3.Database(':memory:');

  // 데이터베이스 테이블 생성 및 샘플 데이터 삽입
  db.serialize(() => {
    // Users 테이블
    db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT,
      email TEXT,
      role TEXT,
      secret_token TEXT
    )`);

    db.run(`INSERT INTO users (username, password, email, role, secret_token) VALUES
      ('admin', 'admin123', 'admin@example.com', 'admin', 'secret_admin_token_xyz'),
      ('player1', 'pass123', 'player1@example.com', 'user', 'token_abc123'),
      ('player2', 'pass456', 'player2@example.com', 'user', 'token_def456'),
      ('testuser', 'test123', 'test@example.com', 'user', 'token_test789')`);

    // Games 테이블
    db.run(`CREATE TABLE games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      price INTEGER,
      genre TEXT
    )`);

    db.run(`INSERT INTO games (title, description, price, genre) VALUES
      ('슈퍼 어드벤처', 'RPG 게임입니다', 5000, 'RPG'),
      ('레이싱 챔피언', '레이싱 게임입니다', 3000, 'Racing'),
      ('퍼즐 마스터', '두뇌 게임입니다', 2000, 'Puzzle'),
      ('액션 히어로', '액션 게임입니다', 4500, 'Action')`);

    console.log('✓ 데이터베이스 초기화 완료');
  });

  return db;
}

module.exports = initDatabase;
