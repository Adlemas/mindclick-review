import axios from "axios";
import { baseURL } from "api/axios";
import { getItemFromLocal, setItemInLocal } from 'utils/localStorage';

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

const refreshToken = async () => {
  try {
    const refreshToken = getItemFromLocal("refreshToken");

    const body = {
      source: "WEB_APP",
    };

    const options = {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const { data } = await axios.post<RefreshTokenResponse>(
      `${baseURL}login/refresh`,
      body,
      options,
    );

    setItemInLocal("token", data.token);
    setItemInLocal("refreshToken", data.refreshToken);

    return data;
  } catch (error) {
    throw error;
  }
};

export default refreshToken;
