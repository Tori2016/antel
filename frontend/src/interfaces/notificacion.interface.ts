export interface INotication {
  _id: string;
  userId: string;
  dId: string;
  deviceName: string;
  payload: Payload;
  emqxRuleId: string;
  topic: string;
  setPoint: number;
  condition: string;
  variable: string;
  variableFullName: string;
  unit: string;
  readed: boolean;
  time: number;
}

export interface Payload {
  value: number;
}
