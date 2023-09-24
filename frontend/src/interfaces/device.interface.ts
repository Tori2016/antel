import { IAlarm } from "./alarm.interface";
import { ITemplate } from "./template.interface";

export interface IDevice {
  _id: string;
  userId: string;
  dId: string;
  name: string;
  saveRule: SaveRule;
  alarmRules: IAlarm[];
  password: string;
  selected: boolean;
  template: ITemplate;
  description: string;
  createdAt: number;
}

export interface SaveRule {
  _id: string;
  userId: string;
  dId: string;
  emqxRuleId: string;
  status: boolean;
}

export interface IFormDevice {
  name: string;
  dId: string;
  description: string;
  template: string;
}
