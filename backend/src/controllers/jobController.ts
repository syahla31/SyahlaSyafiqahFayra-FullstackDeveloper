import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const getJobs = async (_req: AuthRequest, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: { select: { name: true } } }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, location, salary, jobType, description } = req.body;
    const companyId = req.user?.id;

    if (!companyId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const job = await prisma.job.create({
      data: { title, location, salary, jobType, description, companyId }
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};