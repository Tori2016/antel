import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

interface Payload {
  type: string;
  lat?: number;
  lng?: number;
  value?: number;
  save: number;
}

export type DataDocument = HydratedDocument<Data>;

@Schema({ versionKey: false })
export class Data {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: Types.ObjectId;
  @Prop({ type: String, required: true })
  dId: string;
  @Prop({ type: String, required: true })
  variable: string;
  @Prop({ type: Object, required: true })
  value: Payload;
  @Prop({ type: Number, required: true })
  time: number;
}

export const DataSchema = SchemaFactory.createForClass(Data);
