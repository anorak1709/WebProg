import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = Router();
router.use(auth, admin);

// GET /api/admin/users
router.get('/users', (req, res) => {
  const users = db.prepare('SELECT id, username, role, created_at FROM users').all();
  const mapped = users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    createdAt: u.created_at,
  }));
  res.json({ users: mapped });
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', (req, res) => {
  const { role } = req.body;
  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'role must be "admin" or "user"' });
  }

  const target = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);

  // Log the role change
  db.prepare(
    'INSERT INTO access_logs (id, user_id, username, action, details, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(uuidv4(), req.user.id, req.user.username, 'role_change', `${target.username}: ${target.role} → ${role}`, Date.now());

  res.json({ user: { id: target.id, username: target.username, role } });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }

  const target = db.prepare('SELECT id, username FROM users WHERE id = ?').get(req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);

  // Log the deletion
  db.prepare(
    'INSERT INTO access_logs (id, user_id, username, action, details, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(uuidv4(), req.user.id, req.user.username, 'user_deleted', `Deleted: ${target.username}`, Date.now());

  res.json({ success: true });
});

// GET /api/admin/logs
router.get('/logs', (req, res) => {
  const logs = db.prepare('SELECT * FROM access_logs ORDER BY timestamp DESC').all();
  const mapped = logs.map(l => ({
    id: l.id,
    userId: l.user_id,
    username: l.username,
    action: l.action,
    details: l.details,
    timestamp: l.timestamp,
  }));
  res.json({ logs: mapped });
});

export default router;
