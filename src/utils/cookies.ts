import { jwtDecode } from "jwt-decode";

import Cookies from "js-cookie";

export interface JwtPayload {
  exp: number;
}

export const decodeToken = (token: string): JwtPayload => jwtDecode(token);

export const setToken = (token: string) => {
  const { exp } = decodeToken(token);

  Cookies.set("accessToken", token, {
    expires: new Date(exp * 1000),
  });
};

export const removeToken = () => Cookies.remove("accessToken");
export const Authorization = () => "Bearer " + Cookies.get("accessToken");
export const getToken = () => Cookies.get("accessToken");
