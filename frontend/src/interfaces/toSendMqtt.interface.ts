export interface IToSendMqtt {
  topic: string;
  msg: {
    value: boolean;
  };
}
