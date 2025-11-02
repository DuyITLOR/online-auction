import { Request, Response } from 'express';

export const signIn = async (req: Request, res: Response) => {
  res.status(200).send('Sign in');
};

export const signUp = async (req: Request, res: Response) => {
  res.status(200).send('Sign up');
};
