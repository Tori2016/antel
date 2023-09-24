export interface IAlarm {
  _id: string;
  userId: string;
  dId: string;
  emqxRuleId: string;
  variableFullName: string;
  variable: string;
  unit: string;
  setPoint: number;
  condition: string;
  triggerTime: number;
  status: boolean;
  counter: number;
  createdAt: number;
}
