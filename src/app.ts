import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import createError, { HttpError } from 'http-errors';
import router from './router';
import './passport-config';

import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DB_URI!, { dbName: 'members-only' })
  .catch((err) => console.error(err));

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 30
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net']
    }
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: 'members-only'
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

app.use(function (req, res, next) {
  next(createError(404, 'Page Not Found'));
});

app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDevEnv = req.app.get('env') === 'development';

  res.status(err.status || 500).render('error', {
    error: {
      message:
        res.statusCode >= 500
          ? isDevEnv
            ? err.message
            : 'Server Error'
          : err.message,
      status: res.statusCode,
      stack: isDevEnv ? err.stack : null
    }
  });
});

export default app;
