export interface ITemplate {
  _id: string;
  userId: string;
  name: string;
  description: string;
  widgets: Widget[];
  counter: number;
  createdAt: number;
}

export interface Widget {
  userId: string;
  selectedDevice: SelectedDevice;
  variableFullName: string;
  variable: string;
  variableType: string;
  variableSendFreq?: string;
  unit?: string;
  decimalPlaces?: number;
  class: string;
  column: string;
  widget: string;
  icon: string;
  chartTimeAgo?: number;
  demo?: boolean;
  zoomMap?: number;
  message?: string;
  text?: string;
}

export interface SelectedDevice {
  name: string;
  dId: string;
}

export interface IFormTemplate {
  name: string;
  description: string;
}
