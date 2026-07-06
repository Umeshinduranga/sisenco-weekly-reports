import { FilterQuery } from 'mongoose';
import { Report, type IReport } from '../models/Report';

export const reportRepository = {
  async findByUser(userId: string): Promise<IReport[]> {
    return Report.find({ userId }).populate('projectId', 'name').sort({ weekStart: -1 });
  },

  async findById(id: string): Promise<IReport | null> {
    return Report.findById(id);
  },

  async findAll(filter: FilterQuery<IReport>): Promise<IReport[]> {
    return Report.find(filter)
      .populate('userId', 'fullName email')
      .populate('projectId', 'name')
      .sort({ weekStart: -1 });
  },

  async create(data: Record<string, unknown>): Promise<IReport> {
    return Report.create(data);
  },

  async update(id: string, data: Record<string, unknown>): Promise<IReport | null> {
    return Report.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
};
