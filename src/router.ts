import { Router } from 'express';
import * as controller from './controller';

const router = Router();

router.get('/', controller.index);
router.get('/login', controller.loginGet);
router.post('/login', controller.loginPost);
router.get('/register', controller.registerGet);
router.post('/register', controller.registerPost);
router.get('/logout', controller.logout);
router.get('/upgrade', controller.upgradeGet);
router.post('/upgrade', controller.upgradePost);
router.get('/message/create', controller.createGet);
router.post('/message/create', controller.createPost);
router.get('/message/:id/delete', controller.deleteGet);
router.post('/message/:id/delete', controller.deletePost);

export default router;
