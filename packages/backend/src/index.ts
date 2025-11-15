import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { Transaction, initTransaction } from './models/Transaction';
import coinRoutes from './routes/coinRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Налаштування Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.APPLICATION_DB_HOST || 'db',
  port: parseInt(process.env.APPLICATION_DB_PORT || '5432'),
  database: process.env.APPLICATION_DB_DATABASE || 'crypto_explorer',
  username: process.env.APPLICATION_DB_USERNAME || 'wakawaka',
  password: process.env.APPLICATION_DB_PASSWORD || 'cripacrip',
});

// Ініціалізація моделі
initTransaction(sequelize);

// Синхронізація бази
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

// Перевірка підключення до бази
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(cors({ 
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true 
}));
app.use(express.json());

// API routes
app.use('/api/coins', coinRoutes);

// 404 handler
app.use(notFound);

// Error handler (має бути останнім)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 API available at http://localhost:${port}/api`);
});