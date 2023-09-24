import axios from "axios";

const config = useRuntimeConfig();

const api = axios.create({
  baseURL: config.public.apiUri,
  withCredentials: true,
});

export default api;
