declare namespace Express {
  interface User {
    id?: string;
    role?: 'Admin' | 'Member' | 'User';
  }
}
