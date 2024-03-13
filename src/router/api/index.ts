// Core
import { Router } from 'express';

// Routes
import authRoute from './auth';
import userRouter from './user';
import postRouter from './post';

const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRouter);
router.use('/post', postRouter);

export default router;
