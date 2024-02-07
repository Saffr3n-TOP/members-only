import { Router } from 'express';
import * as controller from './controller';

const router = Router();

router.get('/', controller.index);
router.get('/login', controller.loginGet);
router.post('/login', controller.loginPost);
router.get('/register', controller.registerGet);
router.post('/register', controller.registerPost);
router.get('/logout', controller.logout);

export default router;
