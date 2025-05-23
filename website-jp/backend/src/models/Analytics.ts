import mongoose, { Document, Schema } from 'mongoose';

export interface IVisit extends Document {
  visitorId: string;
  page: string;
  timestamp: Date;
  duration: number;
  referrer?: string;
  userAgent?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  country?: string;
  language?: string;
  ipAddress?: string;
}

export interface IPageView extends Document {
  path: string;
  count: number;
  averageDuration: number;
}

const VisitSchema: Schema = new Schema({
  visitorId: {
    type: String,
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number,
    default: 0,
  },
  referrer: String,
  userAgent: String,
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
  },
  country: String,
  language: String,
  ipAddress: String,
});

const PageViewSchema: Schema = new Schema({
  path: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  averageDuration: {
    type: Number,
    default: 0,
  },
});

export const Visit = mongoose.model<IVisit>('Visit', VisitSchema);
export const PageView = mongoose.model<IPageView>('PageView', PageViewSchema);
