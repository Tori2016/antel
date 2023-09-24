import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ versionKey: false })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: Types.ObjectId;
  @Prop({ type: String, required: true })
  dId: string;
  @Prop({ type: String, required: true })
  deviceName: string;
  @Prop({ type: Object })
  payload: Object;
  @Prop({ type: String, required: true })
  emqxRuleId: string;
  @Prop({ type: String, required: true })
  topic: string;
  @Prop({ type: Number, required: true })
  setPoint: number;
  @Prop({ type: String, required: true })
  condition: string;
  @Prop({ type: String, required: true })
  variable: string;
  @Prop({ type: String, required: true })
  variableFullName: string;
  @Prop({ type: String, required: true })
  unit: string;
  @Prop({ type: Boolean, required: true, default: false })
  readed: boolean;
  @Prop({ type: Number, default: Date.now() })
  time: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
