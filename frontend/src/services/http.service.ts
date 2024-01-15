import axios from "axios";
import { API_URL } from "../constants/url.constant";
import { logout, refresh } from "./auth.service";

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Response interceptor to refresh access token if the error is due to token expiry
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (error.response.status === 401 && isLoggedIn === "true") {
      try {
        await refresh();

        // Retry the original request
        return http(error.config);
      } catch (refreshError) {
        console.log("Error refreshing access token:", refreshError);
        await logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
