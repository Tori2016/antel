import useVuelidate from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";

import Swal from "sweetalert2";

import filesApi from "@/api/filesApi";
import usersApi from "@/api/usersApi";
import authApi from "@/api/authApi";

import imgAvatar from "~/assets/img/avatar.png";

const config = useRuntimeConfig();

const roleCustom = ref("");
const selectedImage = ref<File | null>(null);
const previewImage = ref<string | null>(null);

// F O R M
const submitted = ref<boolean>(false);
const active = ref(true);
const newPass = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const rulesNewPass = computed(() => {
  return {
    oldPassword: { required, minLength: minLength(6) },
    newPassword: { required, minLength: minLength(6) },
    confirmPassword: {
      required,
      sameAsPassword: sameAs(newPass.value.newPassword),
    },
  };
});
const v$ = useVuelidate(rulesNewPass, newPass);
const show = () => {
  active.value = !active.value;
};
const resetForm = () => {
  newPass.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  v$.value.$reset();
};

const useProfile = () => {
  const { loggedUser, accessToken, refreshToken } = useAuth();

  const getRole = (rol: string) => {
    switch (rol) {
      case "admin":
        roleCustom.value = "Administrador";
        break;
      case "advisor":
        roleCustom.value = "Asesor";
        break;
      case "deliveryman":
        roleCustom.value = "Repartidor";
        break;
      case "partner":
        roleCustom.value = "Socio";
        break;
      case "store":
        roleCustom.value = "Restaurante";
        break;
      default:
        roleCustom.value = "Superadmin";
        break;
    }

    return roleCustom.value;
  };

  const handleImageSelected = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length === 0) {
      previewImage.value = null;
      return;
    }
    if (fileInput.files && fileInput.files[0]) {
      selectedImage.value = fileInput.files[0];
      previewImage.value = URL.createObjectURL(selectedImage.value);
    }
  };

  const uploadImage = async () => {
    if (selectedImage.value) {
      const formData: FormData = new FormData();
      formData.append("file", selectedImage.value, selectedImage.value.name);

      try {
        const { data } = await filesApi.uploadAvatar(
          formData,
          accessToken.value
        );
        if (data.message === "FILE_UPLOADED") {
          previewImage.value = null;
          updateUserAvatar(data.avatarName);
        }
      } catch (error: any) {
        Swal.fire({
          title: "¡Error!",
          text: "El archivo no fue cargado, intenta de nuevo.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  };

  const updateUserAvatar = async (file: string) => {
    try {
      const toSend = { avatar: file };
      const { data } = await usersApi.updateAvatar(toSend, accessToken.value);
      if (data.message === "USER_UPDATED") {
        Swal.fire({
          title: "¡Actualizado!",
          text: "El Avatar ha sido actualizado con éxito.",
          icon: "success",
          confirmButtonColor: "#7366FF",
        });
        refreshToken();
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
      }
      if (error.response.data.message === "USER_NOT_UPDATED") {
        Swal.fire({
          title: "¡Error!",
          text: "El usuario no pudo ser actualizado.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      } else {
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
  };

  const deleteAvatar = async () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Desea eliminar su foto de perfil.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7366FF",
      cancelButtonColor: "#ff3364",
      confirmButtonText: "¡Sí, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const file = loggedUser.value.avatar;
          const { data } = await filesApi.deleteAvatar(file, accessToken.value);
          if (data.message === "FILE_DELETED") {
            updateUserAvatar("");
          }
        } catch (error: any) {
          if (
            error.response.data.message === "IMAGE_NOT_FOUND" ||
            error.response.data.message === "IMAGE_DELETED_ERROR"
          ) {
            Swal.fire({
              title: "¡Error!",
              text: "La imagen no pudo ser eliminada.",
              icon: "error",
              confirmButtonColor: "#7366FF",
              confirmButtonText: "OK",
            });
            return;
          } else {
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
      }
    });
  };

  const updatePassword = async () => {
    submitted.value = true;
    v$.value.$touch();
    if (v$.value.$invalid) return;

    try {
      const toSend = {
        oldPassword: newPass.value.oldPassword,
        newPassword: newPass.value.newPassword,
      };
      const { data } = await authApi.updatePassword(toSend, accessToken.value);
      if (data.message === "PASSWORD_UPDATED") {
        Swal.fire({
          title: "¡Actualizada!",
          text: "La contraseña ha sido actualizada con éxito.",
          icon: "success",
          confirmButtonColor: "#7366FF",
        });
        resetForm();
      }
    } catch (error: any) {
      if (error.response.data.message === "Unauthorized") {
        Swal.fire({
          title: "¡Error!",
          text: "Usuario no autorizado.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      } else if (error.response.data.message === "INVALID_CREDENTIALS") {
        Swal.fire({
          title: "¡Error!",
          text: "La contraseña actual no es válida.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      } else if (error.response.data.message === "PASSWORD_NOT_UPDATED") {
        Swal.fire({
          title: "¡Error!",
          text: "La contraseña no pudo ser actualizada.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      } else {
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
  };

  return {
    config,
    deleteAvatar,
    getRole,
    handleImageSelected,
    imgAvatar,
    previewImage,
    uploadImage,
    newPass,
    v$,
    submitted,
    active,
    show,
    updatePassword,
  };
};

export default useProfile;
