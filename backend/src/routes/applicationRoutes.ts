import { Router } from 'express';
import { applyJob, getCompanyApplications, getMyApplications, updateStatus } from '../controllers/applicationController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.post('/apply', authenticateToken, applyJob);
router.get('/my-applications', authenticateToken, getMyApplications);
router.get('/company-applications', authenticateToken, getCompanyApplications);
router.put('/:id/status', authenticateToken, updateStatus);

export default router;
