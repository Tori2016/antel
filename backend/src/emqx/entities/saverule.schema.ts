import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type SaveruleDocument = HydratedDocument<Saverule>;

@Schema({ versionKey: false })
export class Saverule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  dId: string;

  @Prop({ type: String, required: true })
  emqxRuleId: string;

  @Prop({ type: Boolean, required: true })
  status: boolean;
}

export const SaveruleSchema = SchemaFactory.createForClass(Saverule);
