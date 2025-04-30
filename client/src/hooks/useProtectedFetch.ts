import { useAuth } from "@/contexts/authContext";
import { getAccessToken, setAccessToken } from "@/contexts/accessToken";
import axios, { AxiosRequestConfig } from "axios";

const API_BASE = "http://localhost:3500";

const useProtectedFetch = () => {
  const { logout } = useAuth();

  const refreshToken = async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/auth/newtoken", {
        withCredentials: true,
      });
      if (!res.data.accessToken) {
        throw new Error("No access token received!");
      }
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch (err) {
      throw new Error("TOKEN_REFRESH_FAILED");
    }
  };

  const protectedFetch = async (
    url: string,
    method: string,
    data: Record<string, any> = {},
    optional: AxiosRequestConfig = {}
  ) => {
    let accessToken = getAccessToken();

    if (!accessToken) {
      try {
        accessToken = await refreshToken();
      } catch (err) {
        console.log(
          "Access token missing and refresh failed.Redirecting to login..."
        );

        logout();
      }
    }

    try {
      const response = await axios({
        url,
        method,
        baseURL: API_BASE,
        data: method !== "GET" ? data : undefined,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(optional.headers || {}),
        },
        ...optional,
      });

      return response;
    } catch (err: any) {
      if (
        axios.isAxiosError(err) &&
        (err.response?.status === 401 || err.response?.status === 403)
      ) {
        try {
          const newToken = await refreshToken();
          const retryResponse = await axios({
            url,
            method,
            baseURL: API_BASE,
            data: method !== "GET" ? data : undefined,
            headers: {
              Authorization: `Bearer ${newToken}`,
              ...(optional.headers || {}),
            },
            ...optional,
          });

          return retryResponse;
        } catch (refreshErr) {
          console.log("Token refresh failed, redirecting to login...");
          //? handle logout
          logout();
          return;
        }
      }
      
      //? handle other errors
      throw err;
    }
  };

  return protectedFetch;
};

export default useProtectedFetch;
