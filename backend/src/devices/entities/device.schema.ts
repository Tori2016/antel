import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { Saverule } from '../../emqx/entities';
import { Template } from '../../templates/entities/template.schema';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ versionKey: false })
export class Device {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  dId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, required: true, default: false })
  selected: boolean;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    autopopulate: true,
    required: true,
  })
  template: Template;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Saverule',
    autopopulate: true,
    required: true,
  })
  saveRule: Saverule;

  @Prop({ type: Number, default: Date.now() })
  createdAt: number;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
