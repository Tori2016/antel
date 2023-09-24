import type { IAlarm, IDevice, IWidgetConfig } from "@/interfaces";

export const useDevicesStore = defineStore("devices", () => {
  const { userRole } = useAuth();
  const { $emit } = useNuxtApp();

  const devices = ref<IDevice[]>([]);
  const widgets = ref<IWidgetConfig[]>([]);
  const widgetsInput = ref<IWidgetConfig[]>([]);
  const selectedDevice = ref<any>(null);
  const alarms = ref<IAlarm[]>([]);
  const deviceData = ref({
    deviceSerial: "",
    deviceManufacturer: "",
    deviceFwVersion: "",
    deviceHwVersion: "",
    deviceSdk: "",
    data: {
      deviceRamAvailable: 0,
      deviceRamSizeKb: 0,
      deviceCpuTemp: 0,
      deviceActiveTime: "",
      deviceSpiffsUsed: "",
      deviceCpuClock: "",
      deviceFlashSize: "",
      deviceRestartS: "",
      mqttStatus: false,
      mqttServer: "",
      wifiStatus: false,
      wifiRssiStatus: 0,
      wifiQuality: 0,
    },
  });

  return {
    devices,
    selectedDevice,
    widgets,
    alarms,
    widgetsInput,
    deviceData,

    // Actions
    setDevices(newDevices: IDevice[]) {
      if (userRole.value === "user") {
        newDevices.forEach((device, index) => {
          if (device.selected) {
            selectedDevice.value = device;
            widgets.value = device.template.widgets;
            alarms.value = device.alarmRules;
            $emit("selected-device", device);
            widgetsInput.value = device.template.widgets.filter(
              (widget) => widget.variableType == "input"
            );
          }
        });
      }
      devices.value = newDevices;
    },
    setDeviceData(data: any) {
      deviceData.value = data;
    },
  };
});
