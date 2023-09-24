export interface IAlarm {
  userId: string;
  dId: string;
  deviceName: string;
  payload: Payload;
  topic: string;
  emqxRuleId: string;
  setPoint: number;
  condition: string;
  variable: string;
  variableFullName: string;
  unit: string;
  email: string;
  triggerTime: number;
  time: number;
}

interface Payload {
  value: number;
}
