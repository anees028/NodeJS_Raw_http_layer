import { Router } from 'express';
import { credentialsAuth } from '../middleware/credentialsAuth';
import { getUsersHandler, getUserByIdHandler } from '../controllers/usersController';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.get('/get-users', credentialsAuth, catchAsync(getUsersHandler));
router.get('/get-user_by_id/:id', credentialsAuth, catchAsync(getUserByIdHandler));

export default router;
