import express from 'express';

// Import routes here
import testRouter from './routes/test';
import authRouter from './routes/auth';
import usersRouter from './routes/users';

// Create main router
const router = express.Router();

// Insert routes here
router.use('/auth', authRouter);
router.use('/test', testRouter);
router.use('/users', usersRouter);

export default router;
