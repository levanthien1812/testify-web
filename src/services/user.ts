import { instance } from "../config/axios";
import { TakerGroupBodyItf } from "../types/types";

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

export const unblockUser = async (userIdToUnblock: string) => {
    try {
        const response = await instance.patch(
            `users/unblock/${userIdToUnblock}`
        );

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

export const getTakerGroups = async () => {
    try {
        const response = await instance.get("users/takers/groups");

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTakerGroup = async (body: TakerGroupBodyItf) => {
    try {
        const response = await instance.post("users/takers/groups", body);

        return response.data;
    } catch (error) {
        throw error;
    }
};
