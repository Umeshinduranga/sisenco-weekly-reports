import type { Request, Response } from 'express';
import { reportService } from '../services/reportService';

export const reportController = {
  async getMyReports(req: Request, res: Response) {
    const reports = await reportService.getMyReports(req.user!.id);
    res.status(200).json({ success: true, data: { reports } });
  },

  async create(req: Request, res: Response) {
    const report = await reportService.create(req.body, req.user!.id);
    res.status(201).json({ success: true, data: { report } });
  },

  async update(req: Request, res: Response) {
    const report = await reportService.update(req.params.id, req.body, req.user!.id);
    res.status(200).json({ success: true, data: { report } });
  },

  async submit(req: Request, res: Response) {
    const report = await reportService.submit(req.params.id, req.user!.id);
    res.status(200).json({ success: true, data: { report } });
  },

  async getAll(req: Request, res: Response) {
    const reports = await reportService.getAll(req.query as { member?: string; project?: string; weekStart?: string; weekEnd?: string });
    res.status(200).json({ success: true, data: { reports } });
  },
};
