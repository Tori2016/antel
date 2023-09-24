import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { IWidget } from '../interfaces/widget.interface';

export type TemplateDocument = HydratedDocument<Template>;

@Schema({ versionKey: false })
export class Template {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Array, required: true, default: [] })
  widgets: IWidget[];

  @Prop({ type: Number, default: 0 })
  counter: number;

  @Prop({ type: Number, default: Date.now() })
  createdAt: number;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
