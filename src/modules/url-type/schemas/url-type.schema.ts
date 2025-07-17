import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrlTypeDocument = UrlType & Document;

@Schema({ timestamps: true })
export class UrlType {
  _id: Types.ObjectId; // Explicitly add _id
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const UrlTypeSchema = SchemaFactory.createForClass(UrlType);
