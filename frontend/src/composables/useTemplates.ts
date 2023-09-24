import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import type { Header } from "vue3-easy-data-table";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
// I M P O R T S

import type { IFormTemplate, ITemplate, IWidgetConfig } from "@/interfaces";
import { useTemplatesStore } from "@/store/templates";
import templatesApi from "@/api/templatesApi";

// F O R M
const submitted = ref<boolean>(false);
const selectUser = ref<any>(null);
const templateForm = ref<IFormTemplate>({
  name: "",
  description: "",
});
const rules = computed(() => {
  return {
    name: { required, minLength: minLength(5) },
    description: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(50),
    },
  };
});
const v$ = useVuelidate(rules, templateForm);
const resetForm = () => {
  templateForm.value = {
    name: "",
    description: "",
  };
  v$.value.$reset();
  widgets.value = [];
  widgetType.value = "";
  selectUser.value = null;
};

// T A B L E
const searchValue = ref("");
const headers = ref<Header[]>([
  { text: "NOMBRE", value: "name" },
  { text: "WIDGETS", value: "widgets" },
  { text: "DISPOSITIVOS VINCULADOS", value: "counter" },
  { text: "DESCRIPCIÓN", value: "description" },
  { text: "ACCIONES", value: "operation" },
]);

// W I D G E T S
const widgets = ref<IWidgetConfig[]>([]);
const widgetType = ref("");
const widgetsSelect = [
  {
    value: "numberchart",
    label: "Gráfica de Números",
    icon: "fa6-solid:arrow-left-long",
  },
  {
    value: "indicatorNum",
    label: "Indicador Numérico",
    icon: "fa6-solid:arrow-left-long",
  },
  {
    value: "indicator",
    label: "Indicador de Estado",
    icon: "fa6-solid:arrow-left-long",
  },
  { value: "map", label: "Mapa", icon: "fa6-solid:arrow-left-long" },
  { value: "switch", label: "Interruptor", icon: "fa6-solid:arrow-right-long" },
  {
    value: "button",
    label: "Botón Pulsador",
    icon: "fa6-solid:arrow-right-long",
  },
];
const iconsSelect = [
  {
    value: "fa6-solid:temperature-high",
    label: "Temperatura",
    icon: "fa6-solid:temperature-high",
  },
  {
    value: "fa6-solid:laptop",
    label: "Laptop",
    icon: "fa6-solid:laptop",
  },
  {
    value: "fa6-solid:lightbulb",
    label: "Bombilla",
    icon: "fa6-solid:lightbulb",
  },
  {
    value: "fa6-solid:circle-radiation",
    label: "Radiación",
    icon: "fa6-solid:circle-radiation",
  },
  {
    value: "fa6-solid:rss",
    label: "WiFi",
    icon: "fa6-solid:rss",
  },
  {
    value: "fa6-solid:seedling",
    label: "Planta",
    icon: "fa6-solid:seedling",
  },
  {
    value: "fa6-solid:shower",
    label: "Ducha",
    icon: "fa6-solid:shower",
  },
  {
    value: "fa6-solid:snowflake",
    label: "Nieve",
    icon: "fa6-solid:snowflake",
  },
  {
    value: "fa6-solid:sun",
    label: "Sol",
    icon: "fa6-solid:sun",
  },
  {
    value: "fa6-solid:tv",
    label: "TV",
    icon: "fa6-solid:tv",
  },
  {
    value: "fa6-solid:droplet",
    label: "Gota",
    icon: "fa6-solid:droplet",
  },
  {
    value: "fa6-solid:atom",
    label: "Átomo",
    icon: "fa6-solid:atom",
  },
  {
    value: "fa6-solid:bath",
    label: "Bañera",
    icon: "fa6-solid:bath",
  },
  {
    value: "fa6-solid:bullhorn",
    label: "Megáfono",
    icon: "fa6-solid:bullhorn",
  },
  {
    value: "fa6-solid:charging-station",
    label: "Estación de Carga",
    icon: "fa6-solid:charging-station",
  },
  {
    value: "fa6-solid:cloud-rain",
    label: "Lluvia",
    icon: "fa6-solid:cloud-rain",
  },
  {
    value: "fa6-solid:gear",
    label: "Engranaje",
    icon: "fa6-solid:gear",
  },
  {
    value: "fa-solid:bolt",
    label: "Voltaje",
    icon: "fa-solid:bolt",
  },
  {
    value: "fa6-solid:faucet-drip",
    label: "Goteo",
    icon: "fa6-solid:faucet-drip",
  },
  {
    value: "fa6-solid:fan",
    label: "Ventilador",
    icon: "fa6-solid:fan",
  },
  {
    value: "fa6-solid:cloud",
    label: "Nube",
    icon: "fa6-solid:cloud",
  },
  {
    value: "fa6-solid:bicycle",
    label: "Bicicleta",
    icon: "fa6-solid:bicycle",
  },
  {
    value: "fa6-solid:motorcycle",
    label: "Motocicleta",
    icon: "fa6-solid:motorcycle",
  },
  {
    value: "fa6-solid:car-side",
    label: "Automóvil",
    icon: "fa6-solid:car-side",
  },
  {
    value: "fa6-solid:truck-moving",
    label: "Camión",
    icon: "fa6-solid:truck-moving",
  },
  {
    value: "fa6-solid:truck-monster",
    label: "Camión Monster",
    icon: "fa6-solid:truck-monster",
  },
  {
    value: "fa6-solid:tractor",
    label: "Tractor",
    icon: "fa6-solid:tractor",
  },
];
const colorsSelect = [
  {
    value: "primary",
    label: "Primary",
  },
  {
    value: "secondary",
    label: "Secondary",
  },
  {
    value: "success",
    label: "Success",
  },
  {
    value: "warning",
    label: "Warning",
  },
];
const columnSelect = [
  {
    value: "col-md-3",
    label: "Mínimo",
  },
  {
    value: "col-md-4",
    label: "Pequeño",
  },
  {
    value: "col-md-6",
    label: "Mediano",
  },
  {
    value: "col-md-12",
    label: "Grande",
  },
];
const IotChartConfig = ref<IWidgetConfig>({
  userId: "userid",
  selectedDevice: {
    name: "Home",
    dId: "8888",
  },
  variableFullName: "Temperatura",
  variable: "numberchart",
  variableType: "input",
  variableSendFreq: "10",
  unit: "ºC",
  decimalPlaces: 1,
  class: "primary",
  column: "col-md-6",
  widget: "numberchart",
  icon: "fa6-solid:temperature-high",
  chartTimeAgo: 60,
  demo: true,
});
const iotIndicatorNumConfig = ref<IWidgetConfig>({
  userId: "userid",
  selectedDevice: {
    name: "Home",
    dId: "8888",
  },
  variableFullName: "Temperatura",
  variable: "iotindicatornumber",
  variableType: "input",
  variableSendFreq: "10",
  unit: "ºC",
  decimalPlaces: 1,
  class: "primary",
  column: "col-md-4",
  widget: "indicatorNum",
  icon: "fa6-solid:temperature-high",
});
const iotIndicatorConfig = ref<IWidgetConfig>({
  userId: "userid",
  selectedDevice: {
    name: "Home",
    dId: "21564",
  },
  variableFullName: "Motor",
  variable: "variotindicator",
  variableType: "input",
  variableSendFreq: "10",
  class: "primary",
  widget: "indicator",
  icon: "fa6-solid:gear",
  column: "col-md-4",
});
const iotMapConfig = ref<IWidgetConfig>({
  userId: "userid",
  selectedDevice: {
    name: "Home",
    dId: "8888",
  },
  variableFullName: "GPS For Bicycles",
  variable: "iotmap",
  variableType: "input",
  variableSendFreq: "10",
  class: "success",
  column: "col-md-6",
  zoomMap: 15,
  widget: "map",
  demo: true,
  icon: "fa6-solid:car-side",
});
const iotSwitchConfig = ref<IWidgetConfig>({
  userId: "userid",
  selectedDevice: {
    name: "Home",
    dId: "8888",
  },
  variableFullName: "Motor",
  variable: "iotSwitchConfig",
  variableType: "inout",
  class: "primary",
  widget: "switch",
  icon: "fa6-solid:gear",
  column: "col-md-4",
});
const iotButtonConfig = ref<IWidgetConfig>({
  userId: "userid",
  selectedDevice: {
    name: "Home",
    dId: "8888",
  },
  variableFullName: "Luz",
  variable: "variotbutton",
  variableType: "output",
  class: "primary",
  widget: "button",
  icon: "fa6-solid:lightbulb",
  column: "col-md-4",
  message: "true",
  text: "ON",
});
const addNewWidget = () => {
  if (widgetType.value === "numberchart") {
    IotChartConfig.value.variable = makeid(10);
    widgets.value.push(JSON.parse(JSON.stringify(IotChartConfig.value)));
  }
  if (widgetType.value === "indicatorNum") {
    iotIndicatorNumConfig.value.variable = makeid(10);
    widgets.value.push(JSON.parse(JSON.stringify(iotIndicatorNumConfig.value)));
  }
  if (widgetType.value === "indicator") {
    iotIndicatorConfig.value.variable = makeid(10);
    widgets.value.push(JSON.parse(JSON.stringify(iotIndicatorConfig.value)));
  }
  if (widgetType.value === "map") {
    iotMapConfig.value.variable = makeid(10);
    widgets.value.push(JSON.parse(JSON.stringify(iotMapConfig.value)));
  }
  if (widgetType.value === "switch") {
    iotSwitchConfig.value.variable = makeid(10);
    widgets.value.push(JSON.parse(JSON.stringify(iotSwitchConfig.value)));
  }
  if (widgetType.value === "button") {
    iotButtonConfig.value.variable = makeid(10);
    widgets.value.push(JSON.parse(JSON.stringify(iotButtonConfig.value)));
  }
};
const deleteWidget = (index: number) => {
  widgets.value.splice(index, 1);
};
const makeid = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const useTemplates = () => {
  const store = useTemplatesStore();
  const { templates } = storeToRefs(store);
  const { accessToken, userRole, loggedUser } = useAuth();

  const handleSubmit = async () => {
    submitted.value = true;
    v$.value.$touch();
    if (v$.value.$invalid) return;

    const toSend = {
      name: templateForm.value.name,
      description: templateForm.value.description,
      widgets: widgets.value,
    };

    try {
      const { data } = await templatesApi.create(
        selectUser.value._id,
        toSend,
        accessToken.value
      );
      if (data.message === "TEMPLATE_CREATED") {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "El Template se ha registrado correctamente.",
          icon: "success",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        getTemplates();
        resetForm();
      }
    } catch (error: any) {
      console.log(error.response.data);
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
      }
    }
  };

  const handleDelete = (template: ITemplate) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: `Desea eliminar el Template: ${template.name}`,
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
            const { data } = await templatesApi.remove(
              loggedUser.value._id,
              template._id,
              accessToken.value
            );
            if (data.message === "TEMPLATE_DELETED") {
              Swal.fire({
                title: "¡Eliminado!",
                text: "Template eliminado con éxito.",
                icon: "success",
                confirmButtonColor: "#7366FF",
              });
              getTemplates();
            }
          } else {
            const { data } = await templatesApi.remove(
              template.userId,
              template._id,
              accessToken.value
            );
            if (data.message === "TEMPLATE_DELETED") {
              Swal.fire({
                title: "¡Eliminado!",
                text: "Template eliminado con éxito.",
                icon: "success",
                confirmButtonColor: "#7366FF",
              });
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
          } else if (error.response.data.message === "TEMPLATE_IN_USE") {
            Swal.fire({
              title: "¡Error!",
              text: "Template en uso, elimina primero el dispositivo vinculado.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          } else if (error.response.data.message === "TEMPLATE_NOT_DELETED") {
            Swal.fire({
              title: "¡Error!",
              text: "El Template no fue eliminado.",
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

  const getTemplates = async (): Promise<ITemplate[]> => {
    if (userRole.value === "admin") {
      const query = "";
      const { data } = await templatesApi.findAll(query, accessToken.value);
      store.setTemplates(data);
      return data;
    } else {
      const query = `?userId=${loggedUser.value._id}`;
      const { data } = await templatesApi.findAll(query, accessToken.value);
      store.setTemplates(data);
      return data;
    }
  };

  onMounted(async () => {
    await getTemplates();
  });

  return {
    addNewWidget,
    colorsSelect,
    columnSelect,
    deleteWidget,
    iconsSelect,
    iotButtonConfig,
    IotChartConfig,
    iotIndicatorConfig,
    iotIndicatorNumConfig,
    iotMapConfig,
    iotSwitchConfig,
    widgets,
    widgetsSelect,
    widgetType,
    //F O R M
    handleSubmit,
    resetForm,
    selectUser,
    submitted,
    templateForm,
    v$,
    // T A B L E
    handleDelete,
    headers,
    searchValue,
    templates,
  };
};

export default useTemplates;
