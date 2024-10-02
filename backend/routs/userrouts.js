
// backend -> routs -> userrouts.js

import express from 'express';
import { registerUser, loginUser, adminLogin, getQrCode } from '../controllers/usercontroller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/qr-code', authMiddleware, getQrCode);

export default router;
