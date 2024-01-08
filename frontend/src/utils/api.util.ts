import axios from "axios";
import { API_URL } from "../constants/url.constant";

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
