import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};


export const getLatestSessionsByUserID = async (user_id: string): Promise<string | null> => {
 try {
    const res = await API.get(`/conversations/latest-session?id=${user_id}`);
    console.log("getLatestSessionsByUserID",res.data)
    return res.data?.session_id || null;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};


export const getLatestConversation = async (email: string) => {
  try {
    const res = await API.get(`/conversations/latest?email=${email}`);
    return res.data?.id || null;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.data?.detail === "No conversations found") {
        return null;
      }
    }
    throw err;
  }
};

export default API;
