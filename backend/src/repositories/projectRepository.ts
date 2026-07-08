import {Project} from '../models/Project';

export const projectRepository = {
  findAll: async () => await Project.find().sort({ createdAt: -1 }),
  findById: async (id: string) => await Project.findById(id),
  create: async (data: any) => await Project.create(data),
  update: async (id: string, data: any) => await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  delete: async (id: string) => await Project.findByIdAndDelete(id),
};