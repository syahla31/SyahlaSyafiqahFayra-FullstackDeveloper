import { Router } from 'express';
import { getJobs, createJob } from '../controllers/jobController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
const router = Router();
router.get('/', getJobs);
router.post('/', authenticateToken, authorizeRole('COMPANY'), createJob);
export default router;