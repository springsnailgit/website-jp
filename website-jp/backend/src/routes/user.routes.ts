import express from 'express';
import { createUser, getMe, login, register } from '../controllers/user.controller';
import { authorize, protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// 管理员路由
router.post('/admin', protect, authorize('admin'), createUser);

export default router;
