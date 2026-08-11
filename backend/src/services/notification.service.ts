import prisma from '../config/db';
import { AppError } from '../utils/AppError';

export const getNotifications = async (userId: string, query: any) => {
  const { isRead, page = '1', limit = '10' } = query;
  
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const where: any = { userId };
  if (isRead !== undefined) where.isRead = isRead === 'true';

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where }),
  ]);

  return { notifications, meta: { page: pageNumber, limit: pageSize, total } };
};

export const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  
  if (!notification) throw new AppError('Notification not found', 404);
  if (notification.userId !== userId) throw new AppError('Access denied', 403);

  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};
