import { instance } from "../config/axios";

export const getTakersStatistics = async () => {
    try {
        const response = await instance.get("users/takers/statistics");

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTakers = async () => {
    try {
        const response = await instance.get("users/takers");

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const blockUser = async (id: string) => {
    try {
        const response = await instance.patch(`users/block/${id}`);

        return response.data;
    } catch (error) {
        throw error;
    }
};
