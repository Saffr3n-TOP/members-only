import { Schema, model } from 'mongoose';

type User = {
  email: string;
  hash: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Member' | 'User';
};

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['Admin', 'Member', 'User'],
      default: 'User'
    }
  },
  { collection: 'users' }
);

UserSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = model<User>('User', UserSchema);
export default User;
