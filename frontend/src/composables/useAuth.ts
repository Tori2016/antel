import useVuelidate from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";

import { useAuthStore } from "@/store/auth";
import authApi from "@/api/authApi";

const toast = useToast();

// L O G I N
const isComfirmAccount = ref(false);
const submitted = ref<boolean>(false);
const active = ref(true);
const auth = ref({
  email: "",
  password: "",
});
const rules = computed(() => {
  return {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  };
});
const v$ = useVuelidate(rules, auth);
const show = () => {
  active.value = !active.value;
};

// F O R G O T - P A S S W O R D
const isValidToken = ref(false);
const forgot = ref({
  email: "",
});
const rulesForgot = computed(() => {
  return {
    email: { required, email },
  };
});
const forgot$ = useVuelidate(rulesForgot, forgot);

const newPass = ref({
  password: "",
  confirmPassword: "",
});
const rulesNewPass = computed(() => {
  return {
    password: { required, minLength: minLength(6) },
    confirmPassword: {
      required,
      sameAsPassword: sameAs(newPass.value.password),
    },
  };
});
const newPass$ = useVuelidate(rulesNewPass, newPass);

const resetForm = () => {
  auth.value = {
    email: "",
    password: "",
  };
  forgot.value = {
    email: "",
  };
  newPass.value = {
    password: "",
    confirmPassword: "",
  };
  v$.value.$reset();
  forgot$.value.$reset();
  newPass$.value.$reset();
};

const useAuth = () => {
  const router = useRouter();
  const store = useAuthStore();
  const { loggedUser, userRole, accessToken } = storeToRefs(store);

  const handleSubmit = async () => {
    submitted.value = true;
    v$.value.$touch();

    if (v$.value.$invalid) return;

    try {
      const res = await store.login(auth.value);
      if (res) {
        toast.success(`Hola ${res.user.firstName}, Bienvenido a Antel.`);
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (error === "USER_NOT_FOUND") {
        toast.error("El usuario no se encuentra registrado en Antel.");
      } else if (error === "INVALID_CREDENTIALS") {
        toast.error("Credenciales inválidas.");
      } else if (error === "USER_UNVERIFIED") {
        toast.error("Su cuenta no se encuentra verificada.");
      } else if (error === "USER_INACTIVE") {
        toast.error("Su cuenta se encuentra actualmente suspendida.");
      } else {
        console.log(error);
        return;
      }
    }
  };

  const handleLogout = async () => {
    try {
      const res = await store.logout();
      if (res) {
        toast.success("Se ha cerrado la sesión con éxito.");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleForgot = async () => {
    submitted.value = true;
    forgot$.value.$touch();

    if (forgot$.value.$invalid) return;

    try {
      const { data } = await authApi.forgotPassword({
        email: forgot.value.email,
      });
      if (data.message === "SEND_TOKEN") {
        Swal.fire({
          title: "¡Éxito!",
          text: "Se envió un correo electrónico con las instrucciones para restablecer tu contraseña.",
          icon: "success",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        resetForm();
      }
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data.message === "TOKEN_NOT_SEND") {
        Swal.fire({
          title: "Error!",
          text: "No fue posible restablecer tu contraseña, verifica que el correo electrónico sea correcto.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
      }
      return;
    }
  };

  const handleUpdate = async (token: string) => {
    submitted.value = true;
    newPass$.value.$touch();
    if (newPass$.value.$invalid) return;

    try {
      const { data } = await authApi.updatePasswordToken(token, {
        password: newPass.value.password,
      });
      if (data.message === "PASSWORD_UPDATED") {
        Swal.fire({
          title: "¡Felicidades!",
          text: "Su contraseña ha sido restablecida correctamente.",
          icon: "success",
          confirmButtonColor: "#7366FF",
        }).then(async (result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
      }
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data.message === "PASSWORD_NOT_UPDATED") {
        Swal.fire({
          title: "Error!",
          text: "Lo sentimos su contraseña no pude ser restablecida, intentalo de nuevo.",
          icon: "success",
          confirmButtonColor: "#7366FF",
        });
      }
    }
  };

  const verifyAccount = async (token: string) => {
    try {
      const { data } = await authApi.verifyAccount(token);
      if (data.message === "ACCOUNT_VERIFIED") {
        isComfirmAccount.value = true;
      }
    } catch (error: any) {
      console.log(error.response.data);
      isComfirmAccount.value = false;
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const { data } = await authApi.verifyToken(token);
      if (data.message === "TOKEN_VALID") {
        isValidToken.value = true;
      }
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data.message === "TOKEN_INVALID") {
        isValidToken.value = false;
      }
    }
  };

  return {
    toast,
    // A U T H
    accessToken,
    handleLogout,
    loggedUser,
    userRole,
    logout: () => store.logout(),
    refreshToken: () => store.refreshToken(),
    // L O G I N
    active,
    auth,
    handleSubmit,
    show,
    submitted,
    v$,
    isComfirmAccount,
    verifyAccount,
    // F O R G O T
    forgot,
    forgot$,
    handleForgot,
    verifyToken,
    isValidToken,
    // N E W
    handleUpdate,
    newPass,
    newPass$,
  };
};

export default useAuth;
