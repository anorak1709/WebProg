import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from './db/init.js';

const users = [
  { id: 'admin-001', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 'user-001', username: 'user', password: 'user123', role: 'user' },
];

const existing = db.prepare('SELECT COUNT(*) as count FROM users').get();

if (existing.count === 0) {
  const insert = db.prepare(
    'INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const insertLog = db.prepare(
    'INSERT INTO access_logs (id, user_id, username, action, details, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const now = Date.now();

  for (const user of users) {
    const hash = bcrypt.hashSync(user.password, 10);
    insert.run(user.id, user.username, hash, user.role, now);
    insertLog.run(uuidv4(), user.id, user.username, 'register', 'Seeded account', now);
    console.log(`Created ${user.role}: ${user.username}`);
  }

  console.log('Seed complete.');
} else {
  console.log(`Database already has ${existing.count} user(s). Skipping seed.`);
}
