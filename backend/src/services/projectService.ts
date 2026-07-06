import { ApiError } from '../utils/ApiError';
import { projectRepository } from '../repositories/projectRepository';
import { ProjectCreateInput, ProjectUpdateInput } from '../validators/projectValidators';

export const projectService = {
  async list() {
    return projectRepository.findAll();
  },

  async create(input: ProjectCreateInput, managerId: string) {
    return projectRepository.create({ ...input, createdBy: managerId });
  },

  async update(id: string, input: ProjectUpdateInput) {
    const project = await projectRepository.update(id, input);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    return project;
  },

  async remove(id: string) {
    const project = await projectRepository.delete(id);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    return project;
  },
};
