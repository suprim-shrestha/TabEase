import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_URL } from "../constants/url.constant";
import { logout, refresh } from "./auth.service";

export class HttpClient {
  private static http: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  private static async request(
    url: string,
    method: string,
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> {
    try {
      const response = await HttpClient.http({
        url,
        method,
        ...options,
      });

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (error.response?.status === 401 && isLoggedIn === "true") {
          try {
            await refresh();

            return HttpClient.request(url, method, options);
          } catch (error) {
            await logout();
          }
        }
      }
      throw error;
    }
  }

  static async get(url: string, options: AxiosRequestConfig = {}) {
    return HttpClient.request(url, "get", options);
  }

  static async post(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    options: AxiosRequestConfig = {}
  ) {
    return HttpClient.request(url, "post", {
      ...options,
      data,
    });
  }

  static async put(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    options: AxiosRequestConfig = {}
  ) {
    return HttpClient.request(url, "put", {
      ...options,
      data,
    });
  }

  static async delete(url: string, options: AxiosRequestConfig = {}) {
    return HttpClient.request(url, "delete", options);
  }
}
