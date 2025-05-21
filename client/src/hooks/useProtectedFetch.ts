import { useAuth } from "@/contexts/authContext";
import useAccessTokenStore from "@/stores/accessTokenStore";
import axios, { AxiosRequestConfig } from "axios";
import useToast from "@/hooks/useToast";
import { useCallback } from "react";

const API_BASE = "http://localhost:3500";

const useProtectedFetch = () => {
  const toast = useToast();
  const { logout } = useAuth();

  const getAccessToken = useAccessTokenStore((state) => state.getAccessToken);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);

  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/auth/newtoken", {
        withCredentials: true,
      });
      if (!res.data.accessToken) {
        throw new Error("No access token received!");
      }
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch {
      throw new Error("TOKEN_REFRESH_FAILED");
    }
  },[setAccessToken])

  const protectedFetch = useCallback(async (
    url: string,
    method: string,
    data: AxiosRequestConfig["data"] = {},
    optional: AxiosRequestConfig = {}
  ) => {
    let accessToken = getAccessToken();

    if (!accessToken) {
      try {
        accessToken = await refreshToken();
      } catch {
        toast(
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
    } catch (err) {
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
        } catch {
          toast("Token refresh failed, redirecting to login...");
          //? handle logout
          logout();
          return;
        }
      }

      //? handle other errors
      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message || "Some error occurred");
      } else {
        toast("An unexpected error occurred");
      }
    }
  },[getAccessToken,logout,refreshToken,toast])

  return protectedFetch;
};

export default useProtectedFetch;
