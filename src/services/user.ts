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

export const blockUser = async (userIdToBlock: string) => {
    try {
        const response = await instance.patch(`users/block/${userIdToBlock}`);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBlockedInfo = async () => {
    try {
        const response = await instance.get(`users/block`);

        return response.data;
    } catch (error) {
        throw error;
    }
};
