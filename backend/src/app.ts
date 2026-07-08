import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';
import projectRoutes from './routes/projectRoutes';
import reportRoutes from './routes/reportRoutes';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/reports', reportRoutes);

// Error handler MUST be the last middleware
app.use(errorHandler);

export default app;
