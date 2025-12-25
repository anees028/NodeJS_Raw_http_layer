import { Router, Request, Response } from 'express';
import { credentialsAuth } from '../middleware/credentialsAuth';
import { getUsers, getUserById } from '../utils/fetchUsers';

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


router.get('/get-user_by_id/:id', credentialsAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
    
  } catch (err: any) {
    console.error('Failed to fetch user by ID:', err);
    res.status(502).json({ error: 'Failed to fetch user from upstream' });
  }});



export default router;
