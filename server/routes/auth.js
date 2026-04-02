import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_OPTIONS } from '../config.js';
import auth from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function addLog(userId, username, action, details) {
  db.prepare(
    'INSERT INTO access_logs (id, user_id, username, action, details, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(uuidv4(), userId, username, action, details || null, Date.now());
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const trimmed = (username || '').trim();

  if (!trimmed || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (trimmed.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(trimmed);
  if (existing) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  const now = Date.now();

  db.prepare('INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)').run(
    id, trimmed, hash, 'user', now
  );

  addLog(id, trimmed, 'register');
  addLog(id, trimmed, 'login');

  const user = { id, username: trimmed, role: 'user' };
  const token = signToken(user);
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ success: true, user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const trimmed = (username || '').trim();

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(trimmed);
  if (!user || !bcrypt.compareSync(password || '', user.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  addLog(user.id, user.username, 'login');

  const payload = { id: user.id, username: user.username, role: user.role };
  const token = signToken(payload);
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ success: true, user: payload });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Try to log the action if we can identify the user
  const token = req.cookies.token;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      addLog(payload.id, payload.username, 'logout');
    } catch {
      // Token expired or invalid, still clear it
    }
  }
  res.clearCookie('token');
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
