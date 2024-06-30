import { instance } from "../config/axios";

export const getTakersStatistics = async () => {
    try {
        const response = await instance.get("users/takers/statistics");

        return response.data;
    } catch (error) {
        throw error;
    }
};
