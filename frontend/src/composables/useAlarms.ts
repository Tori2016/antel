import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import type { Header } from "vue3-easy-data-table";
import useVuelidate from "@vuelidate/core";
import { minValue, required } from "@vuelidate/validators";
// I M P O R T S

import { useDevicesStore } from "@/store/devices";
import alarmsApi from "@/api/alarmsApi";

// F O R M
const showForm = ref(false);
const submitted = ref(false);
const variables = ref<any>(null);
const selectVariable = ref<any>(null);
const conditions = ref([
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: ">=", label: ">=" },
  { value: "<", label: "<" },
  { value: "<=", label: "<=" },
  { value: "!=", label: "!=" },
]);
const alarmForm = ref<any>({
  setPoint: "",
  triggerTime: "",
  condition: "",
});
const rules = computed(() => {
  return {
    setPoint: { required },
    triggerTime: { required, minValue: minValue(1) },
    condition: { required },
  };
});
const v$ = useVuelidate(rules, alarmForm);
const resetForm = () => {
  alarmForm.value = {
    setPoint: "",
    triggerTime: "",
    condition: "",
  };
  v$.value.$reset();
  showForm.value = false;
};

// T A B L E
const searchValue = ref("");
const headers = ref<Header[]>([
  { text: "VARIABLE", value: "variableFullName" },
  { text: "ID VARIABLE", value: "variable" },
  { text: "CONDICIÓN", value: "condition" },
  { text: "SET POINT", value: "setPoint" },
  { text: "TRIGGER TIME", value: "triggerTime" },
  { text: "MATCHED", value: "counter" },
  { text: "REGLA", value: "alarmRule" },
  { text: "ACCIONES", value: "operation" },
]);

const useAlarms = () => {
  const { accessToken } = useAuth();
  const store = useDevicesStore();
  const { widgets, alarms, selectedDevice } = storeToRefs(store);
  const { getDevices } = useDevices();

  const handleNewAlarm = async () => {
    submitted.value = true;
    v$.value.$touch();
    if (v$.value.$invalid) return;

    const newRule = {
      dId: selectedDevice.value.dId,
      deviceName: selectedDevice.value.name,
      status: true,
      variableFullName: selectVariable.value.variableFullName,
      variable: selectVariable.value.variable,
      unit: selectVariable.value.unit,
      setPoint: alarmForm.value.setPoint,
      condition: alarmForm.value.condition,
      triggerTime: alarmForm.value.triggerTime,
    };

    try {
      const { data } = await alarmsApi.create(newRule, accessToken.value);
      if (data.message === "ALARM_RULE_CREATED") {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "La alarma se ha creado correctamente.",
          icon: "success",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        await getDevices();
        resetForm();
      }
    } catch (error: any) {
      console.log(error);
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
      } else if (error.response.data.message === "ALARM_NOT_CREATED") {
        Swal.fire({
          title: "¡Error!",
          text: "Error al crear la alarma.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  };

  const handleDelete = async (alarm: any) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Desea eliminar la alarma.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7366FF",
      cancelButtonColor: "#ff3364",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await alarmsApi.deleteAlarmRule(
            alarm.emqxRuleId,
            accessToken.value
          );
          if (data.message === "ALARM_DELETED") {
            Swal.fire({
              title: "¡Eliminada!",
              text: "Alarma eliminada con éxito.",
              icon: "success",
              confirmButtonColor: "#7366FF",
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
          } else if (
            error.response.data.message === "ALARM_NOT_DELETED_IN_EMQX"
          ) {
            Swal.fire({
              title: "¡Error!",
              text: "La alarma no fue eliminada de EMQX.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          } else if (
            error.response.data.message === "ALARM_NOT_DELETED_IN_MONGO"
          ) {
            Swal.fire({
              title: "¡Error!",
              text: "La alarma no fue eliminada de Mongo.",
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

  const updateAlarmRuleStatus = async (alarm: any) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Desea actualizar la alarma.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7366FF",
      cancelButtonColor: "#ff3364",
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      const alarmCopy = JSON.parse(JSON.stringify(alarm));
      alarmCopy.status = !alarmCopy.status;

      const toSend = {
        status: alarmCopy.status,
      };

      if (result.isConfirmed) {
        try {
          const { data } = await alarmsApi.updateAlarmRule(
            alarm.emqxRuleId,
            toSend,
            accessToken.value
          );
          if (data.message === "ALARM_UPDATED") {
            Swal.fire({
              title: "Actualizada!",
              text: "Alarma actualizada con éxito.",
              icon: "success",
              confirmButtonColor: "#7366FF",
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
          } else if (
            error.response.data.message === "ALARM_NOT_UPDATED_IN_EMQX"
          ) {
            Swal.fire({
              title: "¡Error!",
              text: "La alarma no fue actualizada en EMQX.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          } else if (
            error.response.data.message === "ALARM_NOT_UPDATED_IN_MONGO"
          ) {
            Swal.fire({
              title: "¡Error!",
              text: "La alarma no fue actualizada de Mongo.",
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

  return {
    // F O R M
    conditions,
    alarmForm,
    selectVariable,
    submitted,
    resetForm,
    v$,
    showForm,
    variables,
    widgets,
    handleNewAlarm,
    // T A B L E
    searchValue,
    headers,
    alarms,
    handleDelete,
    updateAlarmRuleStatus,
  };
};

export default useAlarms;
