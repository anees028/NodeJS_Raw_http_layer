import { Router, Request, Response } from 'express';
import { credentialsAuth } from '../middleware/credentialsAuth';
import { getUsers } from '../utils/fetchUsers';

const router = Router();

router.get('/get-users', credentialsAuth, async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json({ users });
  } catch (err: any) {
    console.error('Failed to fetch users:', err);
    res.status(502).json({ error: 'Failed to fetch users from upstream' });
  }
});


export default router;
