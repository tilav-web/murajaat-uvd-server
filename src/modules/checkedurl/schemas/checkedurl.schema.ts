import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckedUrlDocument = CheckedUrl & Document;

export enum CheckedUrlStatus {
  ALLOWED = 'allowed',
  BLOCKED = 'blocked',
  PENDING = 'pending',
  UNKNOWN = 'unknown',
}

@Schema({ timestamps: true })
export class CheckedUrl {
  _id: Types.ObjectId; // Explicitly add _id
  @Prop({ required: true, unique: true })
  url: string;

  @Prop({
    type: String,
    enum: Object.values(CheckedUrlStatus),
    default: CheckedUrlStatus.PENDING,
  })
  status: CheckedUrlStatus;

  @Prop({ required: false })
  category?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'UrlType', required: false })
  type?: Types.ObjectId; // Reference to UrlType
}

export const CheckedUrlSchema = SchemaFactory.createForClass(CheckedUrl);
