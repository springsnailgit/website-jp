import express from 'express';
import { exportAnalyticsData, getAnalyticsStats, recordVisit } from '../controllers/analytics.controller';
import { authorize, protect } from '../middleware/auth';

const router = express.Router();

router.post('/visits', recordVisit);
router.get('/stats', protect, authorize('admin'), getAnalyticsStats);
router.get('/export', protect, authorize('admin'), exportAnalyticsData);

export default router;
