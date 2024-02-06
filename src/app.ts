import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import createError, { HttpError } from 'http-errors';

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DB_URI!, { dbName: 'members-only' })
  .catch((err) => console.error(err));

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Members Only' });
});

app.use(function (req, res, next) {
  next(createError(404, 'Page Not Found'));
});

app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500).render('error', {
    error: {
      message: err.message,
      status: res.statusCode,
      stack: req.app.get('env') === 'development' ? err.stack : null
    }
  });
});

export default app;
