import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

// GET /api/transactions?month=YYYY-MM
router.get('/', (req, res) => {
  const { month } = req.query;
  let transactions;
  if (month) {
    transactions = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? AND date LIKE ? ORDER BY date DESC, created_at DESC'
    ).all(req.user.id, `${month}%`);
  } else {
    transactions = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC'
    ).all(req.user.id);
  }
  // Map column names to camelCase for frontend compatibility
  const mapped = transactions.map(t => ({
    id: t.id,
    userId: t.user_id,
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date,
    createdAt: t.created_at,
  }));
  res.json({ transactions: mapped });
});

// POST /api/transactions
router.post('/', (req, res) => {
  const { type, amount, category, description, date } = req.body;
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'type, amount, category, and date are required' });
  }

  const id = uuidv4();
  const now = Date.now();

  db.prepare(
    'INSERT INTO transactions (id, user_id, type, amount, category, description, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, req.user.id, type, amount, category, description || '', date, now);

  res.json({
    transaction: { id, userId: req.user.id, type, amount, category, description: description || '', date, createdAt: now },
  });
});

// PUT /api/transactions/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const { type, amount, category, description, date } = req.body;
  const updated = {
    type: type ?? existing.type,
    amount: amount ?? existing.amount,
    category: category ?? existing.category,
    description: description ?? existing.description,
    date: date ?? existing.date,
  };

  db.prepare(
    'UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, date = ? WHERE id = ? AND user_id = ?'
  ).run(updated.type, updated.amount, updated.category, updated.description, updated.date, req.params.id, req.user.id);

  res.json({
    transaction: { id: req.params.id, userId: req.user.id, ...updated, createdAt: existing.created_at },
  });
});

// DELETE /api/transactions/:id
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json({ success: true });
});

export default router;
