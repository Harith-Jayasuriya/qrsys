import express from 'express';
import { markAttendance, getAttendanceCount } from '../controllers/attendanceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mark', authMiddleware, markAttendance);
router.get('/count', authMiddleware, getAttendanceCount);

export default router;
