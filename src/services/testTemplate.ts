import { instance } from "../config/axios";
import { TestTemplateBodyItf } from "../types/testTemplate";

export const getTestTemplates = async (params?: {
    limit?: number;
    page?: number;
}) => {
    try {
        const response = await instance.get("/test-templates", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTestTemplate = async (templateId: string) => {
    try {
        const response = await instance.get(`/test-templates/${templateId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTestTemplate = async (templateBody: TestTemplateBodyItf) => {
    try {
        const response = await instance.post("/test-templates", templateBody);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTestTemplate = async (
    templateId: string,
    templateBody: Partial<TestTemplateBodyItf>,
) => {
    try {
        const response = await instance.patch(
            `/test-templates/${templateId}`,
            templateBody,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addTemplatePart = async (
    templateId: string,
    partBody: Partial<TestTemplateBodyItf>,
) => {
    try {
        const response = await instance.post(
            `/test-templates/${templateId}/parts`,
            partBody,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTemplatePart = async (
    templateId: string,
    partId: string,
    partBody: Partial<TestTemplateBodyItf>,
) => {
    try {
        const response = await instance.patch(
            `/test-templates/${templateId}/parts/${partId}`,
            partBody,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const moveTemplatePart = async (
    templateId: string,
    partId: string,
    direction: "up" | "down",
) => {
    try {
        const response = await instance.patch(
            `/test-templates/${templateId}/parts/${partId}/move`,
            { direction },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
