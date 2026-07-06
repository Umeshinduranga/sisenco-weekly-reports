import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const projectSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, strict: true }
);

export interface IProject extends InferSchemaType<typeof projectSchema> {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

export const Project = model('Project', projectSchema);
