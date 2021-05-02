import express from 'express';

// Import routes here
import testRouter from './routes/test';

// Create main router
const router = express.Router();

// Insert routes here
router.use('/test', testRouter);

export default router;
