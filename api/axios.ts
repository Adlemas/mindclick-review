import { message } from "antd";
import Axios from "axios";
import { getItemFromLocal, setItemInLocal } from "../utils/localStorage";

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const axios = Axios.create({ baseURL });

axios.interceptors.request.use(
  config => {
    const token = getItemFromLocal("token");
    if (token) {
      config.headers = { ...config.headers, authorization: `Bearer ${token}` };
    }
    return config;
  },
  error => Promise.reject(error),
);

function deleteSession() {
  const event = new Event("forceLogout");
  window.dispatchEvent(event);
  message.error("Ваша сессия закончилась. Пожалуйста войдите снова!");
}
interface RefreshResponseData {
  token: string;
  refreshToken: string;
}

axios.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const originalConfig = err.config;
    if (
      originalConfig.url !== "login/refresh" &&
      originalConfig.url !== "login" &&
      originalConfig.url !== "logout" &&
      originalConfig.url !== "myprofile" &&
      err.response
    ) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refreshToken = getItemFromLocal("refreshToken");
          if (refreshToken) {
            const { data } = await Axios.post<RefreshResponseData>(
              `${baseURL}login/refresh`,
              {
                source: "WEB_APP",
              },
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              },
            );

            setItemInLocal("token", data.token);
            setItemInLocal("refreshToken", data.refreshToken);
            return axios(originalConfig);
          }
          deleteSession();
        } catch (_error) {
          deleteSession();
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  },
);

export default axios;
