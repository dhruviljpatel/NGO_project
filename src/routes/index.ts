import { Router } from 'express';
import authRoutes from './auth.routes';
import volunteerRoutes from './volunteer.routes';
import eventRoutes from './event.routes';
import attendanceRoutes from './attendance.routes';
import beneficiaryRoutes from './beneficiary.routes';
import projectRoutes from './project.routes';
import donationRoutes from './donation.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/events', eventRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/beneficiaries', beneficiaryRoutes);
router.use('/projects', projectRoutes);
router.use('/donations', donationRoutes);
router.use('/notifications', notificationRoutes);

export default router;
