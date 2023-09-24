import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import type { Header } from "vue3-easy-data-table";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
// I M P O R T S

import type { IUser, IFormUser } from "@/interfaces";
import { useUsersStore } from "@/store/users";
import usersApi from "@/api/usersApi";

// F O R M
const submitted = ref(false);
const showForm = ref(false);
const userForm = ref<IFormUser>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
});
const roles = [
  { value: "admin", label: "Administrador" },
  { value: "user", label: "Usuario" },
];
const rules = computed(() => {
  return {
    firstName: { required, minLength: minLength(3) },
    lastName: { required, minLength: minLength(3) },
    email: { required, email },
    phone: { required },
    role: { required },
  };
});
const v$ = useVuelidate(rules, userForm);
const resetForm = () => {
  userForm.value = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  };
  v$.value.$reset();
  showForm.value = false;
};

// T A B L E
const searchValue = ref("");
const headers = ref<Header[]>([
  { text: "NOMBRES", value: "avatar" },
  { text: "APELLIDOS", value: "lastName" },
  { text: "CORREO", value: "email" },
  { text: "TELÉFONO", value: "phone" },
  { text: "ACCIONES", value: "operation" },
]);

const useUsers = () => {
  const store = useUsersStore();
  const { users } = storeToRefs(store);
  const { accessToken } = useAuth();

  const getUsers = async () => {
    try {
      const { data } = await usersApi.getAll(accessToken.value);
      store.setUsers(data);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleSubmit = async () => {
    submitted.value = true;
    v$.value.$touch();
    if (v$.value.$invalid) return;

    try {
      const { data } = await usersApi.create(userForm.value, accessToken.value);
      if (data.message === "USER_CREATED") {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "El usuario se ha registrado correctamente, debe revisar el correo y verificar la cuenta.",
          icon: "success",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        getUsers();
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
      } else if (error.response.data.statusCode === 400) {
        const errorMsg = error.response.data.message.split(" :: ")[1];
        Swal.fire({
          title: "¡Campos Existentes!",
          text: `Los siguientes campos ya se encuentran registrados: ${errorMsg}`,
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

  const handleDelete = async (user: IUser) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: `Desea eliminar al usuario: ${user.firstName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7366FF",
      cancelButtonColor: "#ff3364",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await usersApi.delete(user._id, accessToken.value);
          if (data.message === "USER_DELETED") {
            Swal.fire({
              title: "¡Eliminado!",
              text: "Registro eliminado con éxito.",
              icon: "success",
              confirmButtonColor: "#7366FF",
            });
            getUsers();
          }
        } catch (error: any) {
          Swal.fire({
            title: "¡Error!",
            text: `Error: ${error.response.data.message}`,
            icon: "error",
            confirmButtonColor: "#7366FF",
            confirmButtonText: "OK",
          });
          return;
        }
      }
    });
  };

  const handleStatus = (user: IUser) => {
    const userCopy: IUser = JSON.parse(JSON.stringify(user));
    userCopy.isActive = !userCopy.isActive;

    Swal.fire({
      title: "¿Está seguro?",
      text: `Desea ${
        userCopy.isActive ? "Activar" : "Inactivar"
      }  al usuario: ${user.firstName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7366FF",
      cancelButtonColor: "#ff3364",
      confirmButtonText: `¡Sí, ${
        userCopy.isActive ? "Activalo" : "Inactivalo"
      }!`,
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const toSend = {
          userId: user._id,
          status: userCopy.isActive,
        };
        try {
          const { data } = await usersApi.inactivate(toSend, accessToken.value);
          if (data.message === "USER_STATUS_CHANGE") {
            Swal.fire({
              title: `${userCopy.isActive ? "¡Activado!" : "¡Inactivado!"}`,
              text: `El usuario ha sido ${
                userCopy.isActive ? "Activado" : "Inactivado"
              }.`,
              icon: "success",
              confirmButtonColor: "#7366FF",
            });
            getUsers();
          }
        } catch (error: any) {
          Swal.fire({
            title: "¡Error!",
            text: `Error: ${error.response.data.message}`,
            icon: "error",
            confirmButtonColor: "#7366FF",
            confirmButtonText: "OK",
          });
          return;
        }
      }
    });
  };

  onMounted(() => {
    getUsers();
  });

  return {
    // F O R M
    handleSubmit,
    resetForm,
    roles,
    showForm,
    submitted,
    userForm,
    v$,
    // T A B L E
    headers,
    searchValue,
    users,
    handleDelete,
    handleStatus,
  };
};

export default useUsers;
