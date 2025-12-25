import express from 'express';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Built-in body parser
app.use(express.json());

// Global middleware
app.use(requestLogger);

// Routes
app.use('/', authRoutes);
app.use('/', usersRoutes);

// Error handler (should be last)
app.use(errorHandler);

export default app;
