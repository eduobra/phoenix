import axios from "axios";

export const axiosInstace = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REDIRECT_URI}/api`,
});

export const axiosInstaceBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});
