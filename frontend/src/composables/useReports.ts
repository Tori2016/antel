import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { getCenterOfBounds, getPathLength } from "geolib";
// I M P O R T S
import datasApi from "@/api/datasApi";
import { useDevicesStore } from "@/store/devices";

const datas = ref([]);
// F O R M
const selectVariable = ref<any>(null);
const dataTimeFrom = ref<any>(null);
const dataTimeTo = ref<any>(null);
const preloading = ref(false);

// M A P
const centerMap = ref({
  lat: 0,
  lng: 0,
});
const distance = ref(0);

const useReports = () => {
  const { accessToken } = useAuth();
  const store = useDevicesStore();
  const { selectedDevice, widgetsInput } = storeToRefs(store);

  const getDataSensor = async () => {
    preloading.value = true;
    if (!selectVariable.value) {
      Swal.fire({
        title: "¡Error!",
        text: "Debe seleccionar una variable.",
        icon: "error",
        confirmButtonColor: "#7366FF",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const params = {
        dId: selectedDevice.value.dId,
        variable: selectVariable.value.variable,
      };

      const { data } = await datasApi.getReportDatas(params, accessToken.value);

      if (data) {
        var startDate = dateToUnix(dataTimeFrom.value);
        var endDate = dateToUnix(dataTimeTo.value);

        data.forEach((item: any) => {
          item["variableName"] = selectVariable.value.variableFullName;
          item["fecha"] = unixToDate(item.time);
          item["hora"] = formatTime(item.time);
        });

        const newDatas = data.map((d: any) => ({
          dId: d.dId,
          variable: d.variable,
          variableName: d.variableName,
          value: d.value.value.toFixed(selectVariable.value.decimalPlaces),
          fecha: d.fecha,
          hora: d.hora,
          time: d.time,
          type: d.value.type,
        }));

        if (isNaN(startDate) && isNaN(endDate)) {
          datas.value = newDatas;
        } else if (isNaN(endDate)) {
          var now = new Date();
          endDate = now.getTime();
          const filteredItems = newDatas.filter((item: any) => {
            return item.time >= startDate && item.time <= endDate;
          });
          datas.value = filteredItems;
        } else {
          const filteredItems = newDatas.filter((item: any) => {
            return item.time >= startDate && item.time <= endDate;
          });
          datas.value = filteredItems;
        }
        preloading.value = false;
      }
      return;
    } catch (error) {
      console.log(error);
      preloading.value = false;
      return;
    }
  };

  const getDataGps = async () => {
    if (!selectVariable.value) {
      Swal.fire({
        title: "¡Error!",
        text: "Debe seleccionar una variable.",
        icon: "error",
        confirmButtonColor: "#7366FF",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const params = {
        dId: selectedDevice.value.dId,
        variable: selectVariable.value.variable,
      };

      const { data } = await datasApi.getReportDatas(params, accessToken.value);

      if (data) {
        var startDate = dateToUnix(dataTimeFrom.value);
        var endDate = dateToUnix(dataTimeTo.value);

        data.forEach((item: any) => {
          item["variableName"] = selectVariable.value.variableFullName;
          item["fecha"] = unixToDate(item.time);
          item["hora"] = formatTime(item.time);
        });

        const newPositions = data.map((d: any) => ({
          dId: d.dId,
          variable: d.variable,
          variableName: d.variableName,
          lat: d.value.lat,
          lng: d.value.lng,
          fecha: d.fecha,
          hora: d.hora,
          time: d.time,
          type: d.value.type,
        }));

        if (isNaN(startDate) && isNaN(endDate)) {
          datas.value = newPositions;
        } else if (isNaN(endDate)) {
          var now = new Date();
          endDate = now.getTime();
          const filteredItems = newPositions.filter((item: any) => {
            return item.time >= startDate && item.time <= endDate;
          });
          datas.value = filteredItems;
        } else {
          const filteredItems = newPositions.filter((item: any) => {
            return item.time >= startDate && item.time <= endDate;
          });
          datas.value = filteredItems;
        }

        distance.value = getPathLength(datas.value);

        let centerObject = getCenterOfBounds(datas.value);
        centerMap.value.lat = centerObject.latitude;
        centerMap.value.lng = centerObject.longitude;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleDeleteSensor = (registro: any) => {
    console.log("Eliminando registro de Sensor", registro);
  };

  const handleDeleteGps = (registro: any) => {
    console.log("Eliminando registro de GPS", registro);
  };

  const clearData = () => {
    datas.value = [];
    dataTimeFrom.value = null;
    dataTimeTo.value = null;
    selectVariable.value = null;
  };

  onBeforeUnmount(() => {
    clearData;
  });
  return {
    // F O R M
    datas,
    dataTimeFrom,
    dataTimeTo,
    getDataGps,
    getDataSensor,
    selectedDevice,
    selectVariable,
    widgetsInput,
    clearData,
    preloading,
    // T A B L E
    handleDeleteSensor,
    handleDeleteGps,
    // M A P
    distance,
    centerMap,
  };
};

export default useReports;
