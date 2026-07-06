import { Project, type IProject } from '../models/Project';

export const projectRepository = {
  async findAll(): Promise<IProject[]> {
    return Project.find().sort({ name: 1 });
  },

  async findById(id: string): Promise<IProject | null> {
    return Project.findById(id);
  },

  async create(data: { name: string; description: string; createdBy: string }): Promise<IProject> {
    return Project.create(data);
  },

  async update(id: string, data: Partial<{ name: string; description: string; isActive: boolean }>): Promise<IProject | null> {
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id: string): Promise<IProject | null> {
    return Project.findByIdAndDelete(id);
  },
};
