import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const applyJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.user?.id;

    if (!applicantId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. Cek apakah pengguna sudah pernah melamar pekerjaan ini sebelumnya
    const existingApplication = await prisma.applicationHistory.findFirst({
      where: {
        jobId: jobId,
        applicantId: applicantId,
      },
    });

    if (existingApplication) {
      res.status(400).json({ message: 'Anda sudah melamar pekerjaan ini sebelumnya.' });
      return;
    }

    // 2. Jika belum pernah melamar, simpan lamaran baru
    const application = await prisma.applicationHistory.create({
      data: {
        jobId,
        applicantId,
        status: 'APPLIED',
      },
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (userRole === 'COMPANY') {
      // Jika akun Perusahaan, ambil semua lamaran yang masuk ke lowongan miliknya
      const applications = await prisma.applicationHistory.findMany({
        where: {
          job: {
            companyId: userId,
          },
        },
        include: {
          job: { select: { title: true } },
          applicant: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(applications);
    } else {
      // Jika akun Pencari Kerja, ambil riwayat lamaran yang dikirimnya
      const applications = await prisma.applicationHistory.findMany({
        where: { applicantId: userId },
        include: {
          job: { include: { company: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(applications);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const updated = await prisma.applicationHistory.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCompanyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.id;
    const applications = await prisma.applicationHistory.findMany({
      where: {
        job: {
          companyId: companyId,
        },
      },
      include: {
        job: { select: { title: true } },
        applicant: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};