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

export const readNotification = async (notificationId: string) => {
    try {
        const response = await instance.patch(
            `/notifications/${notificationId}/read`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const readAllNotifications = async () => {
    try {
        const response = await instance.patch(`/notifications/read-all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteNotification = async (notificationId: string) => {
    try {
        const response = await instance.delete(
            `/notifications/${notificationId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
