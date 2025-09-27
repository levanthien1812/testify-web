import { instance } from "../config/axios";

export const getNotifications = async (query: {
    limit?: number;
    oldestNotificationId?: string;
}) => {
    try {
        const response = await instance.get("/notifications", {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
