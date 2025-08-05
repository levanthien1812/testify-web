import { AxiosError, HttpStatusCode } from "axios";
import { TOAST_MESSAGES } from "./constants/toasts";
import { toast } from "react-toastify";

const handleError = (err: unknown) => {
    if (err instanceof AxiosError) {
        if (err.status === HttpStatusCode.Unauthorized) {
            window.location.href = "/login";
            return;
        }
        toast.error(err.response?.data.message);
    } else {
        toast.error(TOAST_MESSAGES.SOMETHING_WENT_WRONG);
    }
};

const queryClientConfig = {
    defaultOptions: {
        queries: {
            onError: handleError,
        },
        mutations: {
            onError: handleError,
        },
    },
};

export default queryClientConfig;
