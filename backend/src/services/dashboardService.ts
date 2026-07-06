import { FilterQuery } from 'mongoose';
import { Project } from '../models/Project';
import { Report, type IReport } from '../models/Report';
import { UserModel } from '../models/User';

type DashboardFilters = {
  weekStart?: string;
  weekEnd?: string;
  projectId?: string;
  memberId?: string;
};

const buildQuery = (filters: DashboardFilters) => {
  const query: FilterQuery<IReport> = {};

  if (filters.weekStart || filters.weekEnd) {
    query.weekStart = {
      ...(filters.weekStart ? { $gte: new Date(filters.weekStart) } : {}),
      ...(filters.weekEnd ? { $lte: new Date(filters.weekEnd) } : {}),
    } as FilterQuery<IReport>["weekStart"];
  }

  if (filters.projectId) {
    query.projectId = filters.projectId;
  }

  if (filters.memberId) {
    query.userId = filters.memberId;
  }

  return query;
};

export const dashboardService = {
  async getSummary(filters: DashboardFilters = {}) {
    const query = buildQuery(filters);

    const [totalReports, submittedReports, draftReports, openBlockers, totalHours] = await Promise.all([
      Report.countDocuments(query),
      Report.countDocuments({ ...query, status: 'submitted' }),
      Report.countDocuments({ ...query, status: 'draft' }),
      Report.countDocuments({ ...query, blockers: { $regex: '\S' } }),
      Report.aggregate([{ $match: query }, { $group: { _id: null, hoursWorked: { $sum: { $ifNull: ['$hoursWorked', 0] } } } }]),
    ]);

    const complianceRate = totalReports === 0 ? 0 : Math.round((submittedReports / totalReports) * 100);

    return {
      totalReports,
      submittedReports,
      draftReports,
      openBlockers,
      totalHours: totalHours[0]?.hoursWorked ?? 0,
      complianceRate,
    };
  },

  async getSubmissionStatus(filters: DashboardFilters = {}) {
    const query = buildQuery(filters);

    return Report.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } },
      { $sort: { status: 1 } },
    ]);
  },

  async getWorkload(filters: DashboardFilters = {}) {
    const query = buildQuery(filters);

    return Report.aggregate([
      { $match: query },
      { $group: { _id: '$userId', totalHours: { $sum: { $ifNull: ['$hoursWorked', 0] } }, reportCount: { $sum: 1 } } },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.fullName',
          email: '$user.email',
          totalHours: 1,
          reportCount: 1,
        },
      },
      { $sort: { totalHours: -1 } },
    ]);
  },

  async getProjectBreakdown(filters: DashboardFilters = {}) {
    const query = buildQuery(filters);

    return Report.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$projectId',
          totalHours: { $sum: { $ifNull: ['$hoursWorked', 0] } },
          reportCount: { $sum: 1 },
          submittedCount: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: Project.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          _id: 0,
          projectId: '$_id',
          name: '$project.name',
          totalHours: 1,
          reportCount: 1,
          submittedCount: 1,
        },
      },
      { $sort: { totalHours: -1 } },
    ]);
  },
};
