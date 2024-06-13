import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../services/auth";

export const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 3000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");

        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// instance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response.status === 403 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             const token = Cookies.get("refresh_token");

//             if (!token) {
//             }

//             const { access, refresh } = await refreshToken(token!);

//             Cookies.set("access_token", access.token, {
//                 expires: new Date(access.expire),
//             });
//             Cookies.set("refresh_token", refresh.token);

//             instance.defaults.headers.common["Authorization"] =
//                 "Bearer " + access.token;
//             // originalRequest.headers.Authorization = "Bearer " + access.token;

//             return instance(originalRequest);
//         }

//         return Promise.reject(error);
//     }
// );
