import type { Request, Response } from 'express';
import { projectService } from '../services/projectService';

export const projectController = {
  async list(_req: Request, res: Response) {
    const projects = await projectService.list();
    res.status(200).json({ success: true, data: { projects } });
  },

  async create(req: Request, res: Response) {
    const project = await projectService.create(req.body, req.user!.id);
    res.status(201).json({ success: true, data: { project } });
  },

  async update(req: Request, res: Response) {
    const project = await projectService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: { project } });
  },

  async remove(req: Request, res: Response) {
    await projectService.remove(req.params.id);
    res.status(200).json({ success: true, data: { message: 'Project deleted' } });
  },
};
