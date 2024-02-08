import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import User from './models/user';
import Message from './models/message';

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
  if (req.user) res.redirect('/');
  res.status(200).render('register', { title: 'Sign Up' });
}

export const registerPost = [
  body('email', 'Email is invalid').trim().notEmpty().bail().isEmail().bail(),
  body('password', 'Password is too short').trim().isLength({ min: 8 }).bail(),
  body('confirm', "Passwords don't match")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .bail(),
  body('firstName', 'First name is required').trim().notEmpty().bail(),
  body('lastName', 'Last name is required').trim().notEmpty(),

  async function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        title: 'Sign Up',
        formData: req.body,
        error: errors.array()[0]
      });
    }

    const hash = await bcrypt.hash(req.body.password, 12).catch(() => {});

    if (!hash) {
      const err = createError(500, 'Server Error');
      return next(err);
    }

    const user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      hash
    });

    const isSaved = !!(await user.save().catch(() => {}));

    if (!isSaved) {
      const err = createError(500, 'No Database Response');
      return next(err);
    }

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }

      res.redirect('/');
    });
  }
];

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
