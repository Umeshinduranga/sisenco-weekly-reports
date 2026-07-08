import { projectRepository } from '../repositories/projectRepository';
import { ApiError } from '../utils/ApiError';

export const projectService = {
  getAllProjects: async () => await projectRepository.findAll(),
  
  createProject: async (data: any) => await projectRepository.create(data),
  
  updateProject: async (id: string, data: any) => {
    const project = await projectRepository.update(id, data);
    if (!project) throw new ApiError(404, 'Project not found');
    return project;
  },
  
  deleteProject: async (id: string) => {
    const project = await projectRepository.delete(id);
    if (!project) throw new ApiError(404, 'Project not found');
    return project;
  }
};