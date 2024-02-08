import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import createError, { HttpError } from 'http-errors';
import User from './models/user';
import Message from './models/message';

export async function index(req: Request, res: Response, next: NextFunction) {
  const messages = await Message.find()
    .sort({ date: -1 })
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
  if (req.user) res.redirect('/');
  res.status(200).render('login', { title: 'Log In' });
}

export async function loginPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate(
    'local',
    function (err: HttpError, user: Express.User, info: { message: string }) {
      if (err) return next(err);

      if (!user) {
        return res.status(400).render('login', {
          title: 'Log In',
          formData: req.body,
          error: { msg: info.message }
        });
      }

      req.login(user, function (err) {
        if (err) return next(err);
        res.redirect('/');
      });
    }
  )(req, res, next);
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
      if (err) return next(err);
      res.redirect('/');
    });
  }
];

export function logout(req: Request, res: Response, next: NextFunction) {
  if (!req.user) res.redirect('/');

  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
}

export function createGet(req: Request, res: Response, next: NextFunction) {
  if (!req.user) res.redirect('/login');
  res.status(200).render('create', { title: 'New Message', user: req.user });
}

export const createPost = [
  body('title', 'Title is required').trim().notEmpty().bail(),
  body('text', 'Message is required').trim().notEmpty(),

  async function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      const err = createError(401, 'Unauthorized');
      return next(err);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('create', {
        title: 'New Message',
        user: req.user,
        formData: req.body,
        error: errors.array()[0]
      });
    }

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: req.user
    });

    const isSaved = !!(await message.save().catch(() => {}));

    if (!isSaved) {
      const err = createError(500, 'No Database Response');
      return next(err);
    }

    res.redirect('/');
  }
];

export function deleteGet(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'Admin') {
    const err = createError(401, 'Unauthorized');
    return next(err);
  }

  res.status(200).render('delete', { title: 'Delete Message', user: req.user });
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== 'Admin') {
    const err = createError(401, 'Unauthorized');
    return next(err);
  }

  const message = await Message.findByIdAndDelete(req.params.id)
    .exec()
    .catch(() => {});

  if (message === undefined) {
    const err = createError(500, 'No Database Response');
    return next(err);
  }

  if (message === null) {
    const err = createError(404, 'Message Not Found');
    return next(err);
  }

  res.redirect('/');
}
