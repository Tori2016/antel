export interface IWebhook {
  type: string;
  status: boolean;
  id: string;
  description: string;
  config: Config;
}

export interface Config {
  verify: boolean;
  url: string;
  request_timeout: string;
  pool_size: number;
  keyfile: File;
  enable_pipelining: boolean;
  connect_timeout: string;
  certfile: File;
  cacertfile: File;
  method: string;
  headers: {
    token: string;
  };
}

export interface File {
  filename: string;
  file: string;
}
