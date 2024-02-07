import { Request as Req, Response, NextFunction } from 'express';
import createError from 'http-errors';
import Message from './models/message';
import User from './models/user';

type Request = Req & { user?: User };

export async function index(req: Request, res: Response, next: NextFunction) {
  const messages = await Message.find()
    .sort({ date: 1 })
    .populate('author', {}, User)
    .exec()
    .catch(() => {});

  if (!messages) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  res.status(200).render('index', {
    title: 'Message Board',
    user: req.user,
    messages
  });
}

export function loginGet(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Login GET route');
}

export function loginPost(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Login POST route');
}

export function registerGet(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Register GET route');
}

export function registerPost(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Register POST route');
}

export function logout(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Logout route');
}

export function createGet(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Message create GET route');
}

export function createPost(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Message create POST route');
}

export function deleteGet(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Message delete GET route');
}

export function deletePost(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Message delete POST route');
}
