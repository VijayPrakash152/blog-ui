import axios, { AxiosError, AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { addTimestampToUrl, getAccessToken, getCookieValue, getXrefToken } from "./helper.service";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Retry logic
axiosRetry(axiosInstance, {
  retries: 3,
  retryCondition: (error) => !error.response || error.response.status >= 500,
});

// Add interceptors
axiosInstance.interceptors.request.use((config) => {
  config.headers.accesstoken = getAccessToken();
  config.headers["x-ref-token"] = getXrefToken();
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

function handleApiError(error: AxiosError) {
  if (error.response?.status === 401 || error.response?.status === 403) {
    if (getCookieValue("source") === "native") {
    } else {
      window.location.href = "/logout";
    }
  } else {
    console.error("API Error:", error.response?.data || error.message);
  }
}

// Helper to get dynamic headers
const getDynamicHeaders = () => ({
  accesstoken: getAccessToken(),
  "x-ref-token": getXrefToken(),
});

// Export API methods (same as previous)
export const postRequest = async <T>(endpoint: string, data: T) => {
  const url = addTimestampToUrl(endpoint);
  return axiosInstance.post(url, data, { headers: getDynamicHeaders() });
};

export const patchRequest = async <T>(endpoint: string, data: T) => {
  const url = addTimestampToUrl(endpoint);
  return axiosInstance.patch(url, data, { headers: getDynamicHeaders() });
};

export const putRequest = async <T>(endpoint: string, data: T) => {
  const url = addTimestampToUrl(endpoint);
  return axiosInstance.put(url, data, { headers: getDynamicHeaders() });
};

export const getRequest = async (endpoint: string,params = {}) => {
  const url = addTimestampToUrl(endpoint);
  return axiosInstance.get(url, { headers: getDynamicHeaders(),params: params });
};

export const getBlobRequest = async (endpoint: string) => {
  const url = addTimestampToUrl(endpoint);
  return axiosInstance.get(url, {
    headers: getDynamicHeaders(),
    responseType: "blob",
  });
};

export const postBlobRequest = async <T>(endpoint: string, data: T) => {
  const url = addTimestampToUrl(endpoint);
  return axiosInstance.post(url, data, {
    headers: getDynamicHeaders(),
    responseType: "blob",
  });
};

export const deleteRequest = async (endpoint: string) => {
  return axiosInstance.delete(endpoint, { headers: getDynamicHeaders() });
};