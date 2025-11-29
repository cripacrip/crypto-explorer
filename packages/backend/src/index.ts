import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, initTransaction } from './models/Transaction';
import User from './models/User.model';
import coinRoutes from './routes/coinRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure Sequelize with sequelize-typescript
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.APPLICATION_DB_HOST || 'db',
  port: parseInt(process.env.APPLICATION_DB_PORT || '5432'),
  database: process.env.APPLICATION_DB_DATABASE || 'crypto_explorer',
  username: process.env.APPLICATION_DB_USERNAME || 'wakawaka',
  password: process.env.APPLICATION_DB_PASSWORD || 'cripacrip',
  models: [User], // Register models here
  logging: false, // Set to console.log to see SQL queries
});

// Initialize Transaction model (old approach)
initTransaction(sequelize as any);

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log('✅ Database synced');
  console.log('📦 Models: User, Transaction');
});

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/coins', coinRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 API available at http://localhost:${port}/api`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST ${port}/api/auth/register`);
  console.log(`   POST ${port}/api/auth/login`);
  console.log(`   GET  ${port}/api/auth/me`);
});