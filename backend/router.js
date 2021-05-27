import express from 'express';

// Import routes here
import testRouter from './routes/test';
import authRouter from './routes/auth';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';

// Create main router
const router = express.Router();

// Insert routes here
router.use('/auth', authRouter);
router.use('/test', testRouter);
router.use('/posts', postsRouter);
router.use('/users', usersRouter);

export default router;
