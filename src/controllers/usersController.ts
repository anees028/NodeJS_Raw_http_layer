import { Request, Response, NextFunction } from 'express';
import { getUsers, getUserById } from '../utils/fetchUsers';

export async function getUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getUsers();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
}

export async function getUserByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id < 1) return res.status(400).json({ error: 'Invalid id' });
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
