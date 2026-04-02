import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';
import adminRoutes from './routes/admin.js';

// Importing db triggers schema creation
import './db/init.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`FinTrack server running on http://localhost:${PORT}`);
});
