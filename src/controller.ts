import { Request, Response, NextFunction } from 'express';

export function index(req: Request, res: Response, next: NextFunction) {
  res.send('NOT IMPLEMENTED: Index route');
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
