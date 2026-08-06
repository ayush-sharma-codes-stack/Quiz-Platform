import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword } from '../utils/password';

export async function listUsers(req: Request, res: Response) {
  const { search, role, status } = req.query;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: String(search) } },
      { email: { contains: String(search) } },
    ];
  }

  if (role) {
    where.role = String(role).toUpperCase();
  }

  if (status) {
    where.status = String(status).toUpperCase();
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      xp: true,
      level: true,
      streak: true,
      createdAt: true,
      _count: { select: { attempts: true } },
    },
  });

  return res.status(200).json({
    success: true,
    users,
  });
}

export async function updateUserStatus(req: Request, res: Response) {
  const { userId } = req.params;
  const { status } = req.body;

  if (!['ACTIVE', 'DEACTIVATED'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be ACTIVE or DEACTIVATED.',
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Prevent self-deactivation
  if (req.user?.userId === userId && status === 'DEACTIVATED') {
    return res.status(400).json({
      success: false,
      message: 'You cannot deactivate your own admin account.',
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return res.status(200).json({
    success: true,
    message: `User status changed to ${status}`,
    user: updatedUser,
  });
}

export async function updateUserRole(req: Request, res: Response) {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['ADMIN', 'STUDENT'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role must be ADMIN or STUDENT.',
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user: updatedUser,
  });
}

export async function resetUserPassword(req: Request, res: Response) {
  const { userId } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long.',
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return res.status(200).json({
    success: true,
    message: `Password for ${user.email} reset successfully by Admin.`,
  });
}
