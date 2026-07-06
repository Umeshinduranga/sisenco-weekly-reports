import { FilterQuery } from 'mongoose';
import { reportRepository } from '../repositories/reportRepository';
import { ApiError } from '../utils/ApiError';
import { ReportCreateInput, ReportUpdateInput } from '../validators/reportValidators';
import { type IReport } from '../models/Report';

export const reportService = {
  async getMyReports(userId: string) {
    return reportRepository.findByUser(userId);
  },

  async create(input: ReportCreateInput, userId: string) {
    return reportRepository.create({ ...input, userId, status: 'draft' });
  },

  async update(id: string, input: ReportUpdateInput, userId: string) {
    const existing = await reportRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, 'Report not found');
    }
    if (existing.userId.toString() !== userId) {
      throw new ApiError(403, 'You can only edit your own reports');
    }
    if (existing.status === 'submitted') {
      throw new ApiError(400, 'Submitted reports cannot be edited');
    }
    return reportRepository.update(id, input);
  },

  async submit(id: string, userId: string) {
    const existing = await reportRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, 'Report not found');
    }
    if (existing.userId.toString() !== userId) {
      throw new ApiError(403, 'You can only submit your own reports');
    }
    return reportRepository.update(id, { status: 'submitted', submittedAt: new Date() });
  },

  async getAll(filters: { member?: string; project?: string; weekStart?: string; weekEnd?: string }) {
    const query: FilterQuery<IReport> = {};

    if (filters.member) {
      query.userId = filters.member;
    }

    if (filters.project) {
      query.projectId = filters.project;
    }

    if (filters.weekStart || filters.weekEnd) {
      query.weekStart = {
        ...(filters.weekStart ? { $gte: new Date(filters.weekStart) } : {}),
        ...(filters.weekEnd ? { $lte: new Date(filters.weekEnd) } : {}),
      } as FilterQuery<IReport>["weekStart"];
    }

    return reportRepository.findAll(query);
  },
};
