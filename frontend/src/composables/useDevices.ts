import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import type { Header } from "vue3-easy-data-table";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
// I M P O R T S

import type { IDevice, IFormDevice } from "@/interfaces";
import { useDevicesStore } from "@/store/devices";
import devicesApi from "@/api/devicesApi";

// F O R M
const selectDevice = ref<any>(null);
const templatesUser = ref<any>([]);
const selectUser = ref<any>([]);
const selectTemplate = ref<any>(null);
const showForm = ref(false);
const submitted = ref(false);
const deviceForm = ref<IFormDevice>({
  dId: "",
  name: "",
  description: "",
  template: "",
});
const rules = computed(() => {
  return {
    name: { required, minLength: minLength(5) },
    dId: { required, minLength: minLength(17), maxLength: maxLength(17) },
    description: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(50),
    },
    template: { required },
  };
});
const v$ = useVuelidate(rules, deviceForm);
const resetForm = () => {
  deviceForm.value = {
    name: "",
    dId: "",
    description: "",
    template: "",
  };
  v$.value.$reset();
  showForm.value = false;
  selectUser.value = [];
  selectTemplate.value = null;
};

// T A B L E
const searchValue = ref("");
const headers = ref<Header[]>([
  { text: "NOMBRE", value: "name" },
  { text: "ID DISPOSITIVO", value: "dId" },
  { text: "CONTRASEÑA", value: "password" },
  { text: "TEMPLATE", value: "template.name" },
  { text: "DESCRIPCIÓN", value: "description" },
  { text: "REGLA", value: "saveRule" },
  { text: "ACCIONES", value: "operation" },
]);

// S E L E C T - D E V I C E

const useDevices = () => {
  const { $listenOn, $listenOff } = useNuxtApp();
  const store = useDevicesStore();
  const { devices, selectedDevice, widgets } = storeToRefs(store);
  const { accessToken, userRole, loggedUser } = useAuth();
  const { templates } = useTemplates();

  const getDevices = async (): Promise<IDevice[]> => {
    if (userRole.value === "admin") {
      const query = "";
      const { data } = await devicesApi.findAll(query, accessToken.value);
      store.setDevices(data);
      return data;
    } else {
      const query = `?userId=${loggedUser.value._id}`;
      const { data } = await devicesApi.findAll(query, accessToken.value);
      store.setDevices(data);
      return data;
    }
  };

  const handleSelect = async (select: any) => {
    const templatesFilter = templates.value.filter(
      (template) => template.userId === select._id
    );
    templatesUser.value = templatesFilter.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  };

  const handleNewDevice = async () => {
    submitted.value = true;
    v$.value.$touch();
    if (v$.value.$invalid) return;

    const toSend = {
      dId: deviceForm.value.dId,
      name: deviceForm.value.name,
      description: deviceForm.value.description,
      template: deviceForm.value.template,
    };

    try {
      const { data } = await devicesApi.create(
        selectUser.value._id,
        toSend,
        accessToken.value
      );
      if (data.message === "DEVICE_CREATED") {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "El dispositivo se ha registrado correctamente.",
          icon: "success",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        getDevices();
        resetForm();
      }
    } catch (error: any) {
      if (
        error.response.data.message === "ROLE_INVALID" ||
        error.response.data.message === "Unauthorized"
      ) {
        Swal.fire({
          title: "¡Error!",
          text: "Usuario no autorizado.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      } else if (error.response.data.message === "SAVERULE_NOT_CREATED") {
        Swal.fire({
          title: "¡Error!",
          text: "Error en API EMQX.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      } else if (error.response.data.message === "DEVICE_NOT_SELECTED") {
        Swal.fire({
          title: "¡Error!",
          text: "Error al crear el dispostivo.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      } else {
        Swal.fire({
          title: "¡Error!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  };

  const handleDelete = (device: IDevice) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: `Desea eliminar el dispositivo: ${device.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7366FF",
      cancelButtonColor: "#ff3364",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (userRole.value === "user") {
            const params = {
              userId: loggedUser.value._id,
              dId: device.dId,
              templateId: device.template._id,
            };
            const { data } = await devicesApi.remove(params, accessToken.value);
            if (data.message === "DEVICE_DELETED") {
              Swal.fire({
                title: "¡Eliminado!",
                text: "Dispositivo eliminado con éxito.",
                icon: "success",
                confirmButtonColor: "#7366FF",
              });
              getDevices();
            }
          } else {
            const params = {
              userId: device.userId,
              dId: device.dId,
              templateId: device.template._id,
            };
            const { data } = await devicesApi.remove(params, accessToken.value);
            if (data.message === "DEVICE_DELETED") {
              Swal.fire({
                title: "¡Eliminado!",
                text: "Dispositivo eliminado con éxito.",
                icon: "success",
                confirmButtonColor: "#7366FF",
              });
              await getDevices();
            }
          }
        } catch (error: any) {
          console.log(error.response.data);
          if (error.response.data.message === "Unauthorized") {
            Swal.fire({
              title: "¡Error!",
              text: "Usuario no autorizado.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          } else if (error.response.data.message === "DEVICE_NOT_DELETED") {
            Swal.fire({
              title: "¡Error!",
              text: "El Dispositivo no fue eliminado.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          }
        }
      }
    });
  };

  const updateSaveRuleStatus = async (device: any) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: `Desea actualizar la regla del dispositivo: ${device.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7366FF",
      cancelButtonColor: "#ff3364",
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deviceCopy = JSON.parse(JSON.stringify(device));
        deviceCopy.saveRule.status = !deviceCopy.saveRule.status;

        const toSend = {
          emqxRuleId: deviceCopy.saveRule.emqxRuleId,
          status: deviceCopy.saveRule.status,
        };
        try {
          const { data } = await devicesApi.updateSaveruleStatus(
            toSend,
            accessToken.value
          );

          if (data.message === "SAVERULE_UPDATED") {
            Swal.fire({
              title: "¡Éxito!",
              text: "La regla se ha actualizado correctamente.",
              icon: "success",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            await getDevices();
          }
        } catch (error: any) {
          console.log(error.response.data);
          if (error.response.data.message === "Unauthorized") {
            Swal.fire({
              title: "¡Error!",
              text: "Usuario no autorizado.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          } else if (error.response.data.message === "SAVERULE_NOT_UPDATED") {
            Swal.fire({
              title: "¡Error!",
              text: "Regla no actualizada.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          }
        }
      }
    });
  };

  const handleSelectDevice = async () => {
    const dId = selectDevice.value.dId;
    try {
      const { data } = await devicesApi.selectedDevice(dId, accessToken.value);
      if (data.message === "DEVICE_SELECTED") {
        await getDevices();
      }
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data.message === "DEVICE_NOT_SELECTED") {
        Swal.fire({
          title: "¡Error!",
          text: "No se pudo seleccionar dispositivo.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  };

  const updateSelectedDevice = (device: any) => {
    selectDevice.value = device;
  };

  onMounted(async () => {
    $listenOn("selected-device", (device) => updateSelectedDevice(device));
    await getDevices();
  });

  onBeforeUnmount(() => {
    $listenOff("selected-device");
    resetForm();
  });

  return {
    getDevices,
    // F O R M
    deviceForm,
    handleSelect,
    handleNewDevice,
    resetForm,
    selectTemplate,
    selectUser,
    showForm,
    submitted,
    templatesUser,
    v$,
    // T A B L E
    devices,
    handleDelete,
    headers,
    searchValue,
    updateSaveRuleStatus,
    // S E L E C T
    selectDevice,
    selectedDevice,
    handleSelectDevice,
    widgets,
  };
};

export default useDevices;
