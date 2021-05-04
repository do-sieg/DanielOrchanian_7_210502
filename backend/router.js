import express from 'express';

// Import routes here
import testRouter from './routes/test';
import authRouter from './routes/auth';

// Create main router
const router = express.Router();

// Insert routes here
router.use('/test', testRouter);
router.use('/auth', authRouter);

export default router;
