import { Model } from 'mongoose';

export interface ModelExt<T> extends Model<T> {
  delete: Function;
  restore: Function;
}
