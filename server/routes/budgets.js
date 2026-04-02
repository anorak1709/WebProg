import { Router } from 'express';
import db from '../db/init.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

// GET /api/budgets?month=YYYY-MM
router.get('/', (req, res) => {
  const { month } = req.query;
  let budgets;
  if (month) {
    budgets = db.prepare(
      'SELECT * FROM budgets WHERE user_id = ? AND month = ?'
    ).all(req.user.id, month);
  } else {
    budgets = db.prepare('SELECT * FROM budgets WHERE user_id = ?').all(req.user.id);
  }
  const mapped = budgets.map(b => ({
    id: b.id,
    category: b.category,
    month: b.month,
    limit: b.limit_amount,
  }));
  res.json({ budgets: mapped });
});

// PUT /api/budgets (upsert)
router.put('/', (req, res) => {
  const { category, month, limit } = req.body;
  if (!category || !month || limit == null) {
    return res.status(400).json({ error: 'category, month, and limit are required' });
  }

  db.prepare(`
    INSERT INTO budgets (user_id, category, month, limit_amount)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, category, month) DO UPDATE SET limit_amount = excluded.limit_amount
  `).run(req.user.id, category, month, limit);

  const budget = db.prepare(
    'SELECT * FROM budgets WHERE user_id = ? AND category = ? AND month = ?'
  ).get(req.user.id, category, month);

  res.json({
    budget: { id: budget.id, category: budget.category, month: budget.month, limit: budget.limit_amount },
  });
});

// DELETE /api/budgets
router.delete('/', (req, res) => {
  const { category, month } = req.body;
  if (!category || !month) {
    return res.status(400).json({ error: 'category and month are required' });
  }

  const result = db.prepare(
    'DELETE FROM budgets WHERE user_id = ? AND category = ? AND month = ?'
  ).run(req.user.id, category, month);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Budget not found' });
  }
  res.json({ success: true });
});

export default router;
