import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type AuthruleDocument = HydratedDocument<Authrule>;

@Schema({ collection: 'emqxauthrules', versionKey: false })
export class Authrule {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String })
  dId: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Array })
  publish: Array<string>;

  @Prop({ type: Array })
  subscribe: Array<string>;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number, default: Date.now() })
  time: number;

  @Prop({ type: Number, default: Date.now() })
  updatedTime: number;
}

export const AuthruleSchema = SchemaFactory.createForClass(Authrule);
