import { AxiosResponse } from "axios";

export const isSuccess = (response: AxiosResponse) => {
    return response.status >= 200 && response.status < 300;
};
