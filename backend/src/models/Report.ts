import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const reportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    tasksCompleted: { type: String, required: true },
    tasksPlanned: { type: String, required: true },
    blockers: { type: String, default: '' },
    hoursWorked: { type: Number, min: 0, max: 168 },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'submitted'], default: 'draft' },
    submittedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false }, strict: true }
);

reportSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

export interface IReport extends InferSchemaType<typeof reportSchema> {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  createdAt: Date;
}

export const Report = model('Report', reportSchema);
