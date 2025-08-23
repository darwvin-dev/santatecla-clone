import axios, { AxiosError } from "axios";

const baseURL =
  typeof window !== "undefined"
    ? `${window.location.origin}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const adminApi = axios.create({
  baseURL,
  withCredentials: true, 
  headers: {
    Accept: "application/json",
  },
});

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}

adminApi.interceptors.request.use((config) => {
  if (!config.headers["Content-Type"] && config.data) {
    config.headers["Content-Type"] = "application/json";
  }
  const csrf = getCookie("csrf");
  if (csrf) {
    config.headers["x-csrf-token"] = csrf;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = (error.config?.url || "").toString();
    if (status === 401 && url.startsWith("/api/admin")) {
      const next = typeof window !== "undefined" ? window.location.pathname : "/";
      window.location.href = `/admin/login?next=${encodeURIComponent(next)}`;
    }
    return Promise.reject(error);
  }
);

export const AdminEndpoints = {
  homeParts: (page: string) =>
    adminApi.get(`/api/dynamic-parts`, { params: { page } }),
  apartments: () => adminApi.get(`/api/apartments`),
};

export default adminApi;
