import { instance } from "../config/axios";
import {
    AddTakersToGroup,
    TakerGroupBodyItf,
    UserBodyItf,
} from "../types/types";

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

export const getMakers = async () => {
    try {
        const response = await instance.get("users/makers");

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

export const getTakerUsersByEmailSearch = async (search: string) => {
    try {
        const response = await instance.get(`users/search?email=${search}`);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (body: UserBodyItf) => {
    try {
        const formData = new FormData();
        formData.append("name", body.name);
        formData.append("email", body.email);
        if (body.gender) formData.append("gender", body.gender);
        if (body.birthday)
            formData.append("birthday", new Date(body.birthday).toISOString());
        if (body.phone_number)
            formData.append("phone_number", body.phone_number);
        if (body.photo) formData.append("file", (body.photo as FileList)[0]);
        if (body.old_password)
            formData.append("old_password", body.old_password);
        if (body.password) formData.append("password", body.password);
        if (body.password_confirm)
            formData.append("password_confirm", body.password_confirm);

        const response = await instance.patch(`users`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMakersWithGroup = async () => {
    try {
        const response = await instance.get("users/makers-group");

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addTakersToGroup = async (data: AddTakersToGroup) => {
    try {
        const response = await instance.patch(
            "users/takers/add-to-group",
            data
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
