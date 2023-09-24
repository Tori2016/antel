import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { User } from '../../users/entities/user.schema';

export type AlarmruleDocument = HydratedDocument<Alarmrule>;

@Schema({ versionKey: false })
export class Alarmrule {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
    required: true,
  })
  user: User;

  @Prop({ type: String, required: true })
  dId: string;

  @Prop({ type: String, required: true })
  emqxRuleId: string;

  @Prop({ type: String })
  variableFullName: string;

  @Prop({ type: String })
  unit: string;

  @Prop({ type: String })
  variable: string;

  @Prop({ type: Number })
  setPoint: number;

  @Prop({ type: String })
  condition: string;

  @Prop({ type: Number })
  triggerTime: number;

  @Prop({ type: Boolean })
  status: boolean;

  @Prop({ type: Number, default: 0 })
  counter: number;

  @Prop({ type: Number, default: Date.now() })
  createdAt: number;
}

export const AlarmruleSchema = SchemaFactory.createForClass(Alarmrule);
