import { Router } from 'express';
import { credentialsAuth } from '../middleware/credentialsAuth';
import { loginHandler } from '../controllers/authController';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.post('/login', credentialsAuth, catchAsync(loginHandler));

export default router;
