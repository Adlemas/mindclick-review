import axios from "api/axios";
import { User } from "types";

/**
 * Response for the Get Auth User API
 */

export interface GetAuthUserResponse {
  user: User;
}

const getAuthUser = async (): Promise<GetAuthUserResponse> => {
  try {
    const { data } = await axios.get<GetAuthUserResponse>(
      `myprofile`,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export default getAuthUser;
