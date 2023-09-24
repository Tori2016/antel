import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ValidRoles } from '../../common/interfaces';
import { uniqueId } from '../../utils';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop({
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    index: true,
  })
  email: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  phone: string;

  @Prop({ type: String, required: true, select: false, trim: true })
  password: string;

  @Prop({ type: String, default: ValidRoles.USER })
  role: ValidRoles;

  @Prop({ type: String, default: uniqueId })
  token: string;

  @Prop({ type: Number, default: 0 })
  tokenExpires: number;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Number, default: Date.now() })
  createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
