import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from '../../user/schemas/user.schema';

export type UserRequestDocument = UserRequest & Document;

@Schema({ timestamps: true })
export class UserRequest {
  _id: Types.ObjectId; // Explicitly add _id

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: UserDocument; // Reference to User

  @Prop({ type: Types.ObjectId, ref: 'CheckedUrl', required: true })
  checkedUrl: Types.ObjectId; // Reference to CheckedUrl
}

export const UserRequestSchema = SchemaFactory.createForClass(UserRequest);
