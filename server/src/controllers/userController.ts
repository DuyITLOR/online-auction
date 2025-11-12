import { Request, Response } from 'express';
import { findUserByEmail, findUserById } from '../services/userService';

export async function getUserIdByEmail(req: Request, res: Response) {
  try {
    const email = (req.body?.email as string | undefined)?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('Error finding user by email:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getUserById(req: Request, res: Response) {
  const { userId } = req.params;

  console.log('user id', userId);
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ id: user.id, email: user.email, name: user.fullname });
  } catch (err) {
    console.error('Error finding user by ID:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
