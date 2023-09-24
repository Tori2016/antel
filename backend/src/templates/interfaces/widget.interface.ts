export interface IWidget {
  userId: string;
  selectedDevice: SelectedDevice;
  variableFullName: string;
  variable: string;
  variableType: string;
  variableSendFreq?: string;
  class: string;
  column: string;
  zoomMap?: number;
  widget: string;
  demo?: boolean;
  icon: string;
  unit?: string;
  decimalPlaces?: number;
  chartTimeAgo?: number;
  message?: string;
  text?: string;
}

export interface SelectedDevice {
  name: string;
  dId: string;
}
