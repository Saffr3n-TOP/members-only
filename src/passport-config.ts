import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import User from './models/user';

passport.use(
  new Strategy({ usernameField: 'email' }, async function (
    email,
    password,
    done
  ) {
    const user = await User.findOne({ email })
      .exec()
      .catch(() => {});

    if (user === undefined) {
      const err = createError(500, 'No Database Response');
      return done(err);
    }

    if (user === null) {
      return done(null, false, { message: 'Incorrect username or password' });
    }

    const isCorrectPassword = await bcrypt
      .compare(password, user.hash)
      .catch(() => {});

    if (isCorrectPassword === undefined) {
      const err = createError(500, 'Server Error');
      return done(err);
    }

    if (!isCorrectPassword) {
      return done(null, false, { message: 'Incorrect username or password' });
    }

    done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
    .exec()
    .catch(() => {});

  if (user === undefined) {
    const err = createError(500, 'No Database Response');
    return done(err);
  }

  done(null, user);
});
