import { useAuth } from "@/contexts/authContext";
// import { getAccessToken, setAccessToken } from "@/contexts/accessToken";
import useAccessTokenStore from "@/stores/accessTokenStore";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

const API_BASE = "http://localhost:3500";

const useProtectedFetch = () => {
  const { logout } = useAuth();

  const getAccessToken = useAccessTokenStore((state)=>state.getAccessToken)
  const setAccessToken = useAccessTokenStore((state)=>state.setAccessToken)

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
        const toastId = toast("Error", {
          description:
            "Access token missing and refresh failed.Redirecting to login...",
          action: {
            label: "Close",
            onClick: () => toast.dismiss(toastId),
          },
        });

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
          const toastId = toast("Error", {
            description: "Token refresh failed, redirecting to login...",
            action: {
              label: "Close",
              onClick: () => toast.dismiss(toastId),
            },
          });
          //? handle logout
          logout();
          return;
        }
      }

      //? handle other errors
      const toastId = toast(err.response.data.message || "Some Error occured", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
    }
  };

  return protectedFetch;
};

export default useProtectedFetch;
