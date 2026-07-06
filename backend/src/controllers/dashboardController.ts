import type { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';

export const dashboardController = {
  async summary(req: Request, res: Response) {
    const summary = await dashboardService.getSummary(req.query as { weekStart?: string; weekEnd?: string; projectId?: string; memberId?: string });
    res.status(200).json({ success: true, data: { summary } });
  },

  async submissionStatus(req: Request, res: Response) {
    const submissionStatus = await dashboardService.getSubmissionStatus(req.query as { weekStart?: string; weekEnd?: string; projectId?: string; memberId?: string });
    res.status(200).json({ success: true, data: { submissionStatus } });
  },

  async workload(req: Request, res: Response) {
    const workload = await dashboardService.getWorkload(req.query as { weekStart?: string; weekEnd?: string; projectId?: string; memberId?: string });
    res.status(200).json({ success: true, data: { workload } });
  },

  async projectBreakdown(req: Request, res: Response) {
    const projectBreakdown = await dashboardService.getProjectBreakdown(req.query as { weekStart?: string; weekEnd?: string; projectId?: string; memberId?: string });
    res.status(200).json({ success: true, data: { projectBreakdown } });
  },
};
