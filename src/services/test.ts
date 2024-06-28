import { instance } from "../config/axios";
import { questionTypes } from "../config/config";
import {
    AnswerBody,
    AnswerItf,
    MultipleChoiceQuestionBodyItf,
    PartBodyItf,
    QuestionBodyItf,
    TakerBodyItf,
    TestBodyItf,
    TestRequestFilter,
    UserAnswer,
} from "../types/types";

export const createTest = async (testBody: TestBodyItf) => {
    try {
        const response = await instance.post("/tests", testBody);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTests = async (filter?: TestRequestFilter | null) => {
    try {
        const response = await instance.get("/tests", {
            params: filter,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTest = async (
    testId: string,
    options?: { with_user_answers?: boolean }
) => {
    try {
        const response = await instance.get(
            `/tests/${testId}${
                options && options.with_user_answers
                    ? "?with_user_answers=true"
                    : ""
            }`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTestWithTakerAnswers = async (
    testId: string,
    takerId: string
) => {
    try {
        const response = await instance.get(
            `/tests/${testId}/submissions/${takerId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTest = async (
    testId: string,
    testBody: Partial<TestBodyItf>
) => {
    try {
        const response = await instance.patch(`/tests/${testId}`, testBody);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const publishTest = async (testId: string) => {
    try {
        const response = await instance.patch(`/tests/${testId}/publish`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addPart = async (testId: string, partBody: PartBodyItf) => {
    try {
        const response = await instance.post(
            `/tests/${testId}/parts`,
            partBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePart = async (
    testId: string,
    partId: string,
    partBody: PartBodyItf
) => {
    try {
        const response = await instance.patch(
            `/tests/${testId}/parts/${partId}`,
            partBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateParts = async (testId: string) => {
    try {
        const response = await instance.get(`/tests/${testId}/parts/validate`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createQuestion = async (
    testId: string,
    questionBody: QuestionBodyItf
) => {
    try {
        const formData = new FormData();

        for (const [key, value] of Object.entries(questionBody)) {
            if (key === "content") {
                formData.append("content", JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }

        if (questionBody.type == questionTypes.MULITPLE_CHOICES) {
            const content =
                questionBody.content as MultipleChoiceQuestionBodyItf;
            for (let i = 0; i < content.images!.length; i++) {
                formData.append(`files[]`, content.images![i]);
            }
        }

        const response = await instance.post(
            `/tests/${testId}/questions`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateQuestion = async (
    testId: string,
    questionId: string,
    questionBody: QuestionBodyItf
) => {
    try {
        const response = await instance.patch(
            `/tests/${testId}/questions/${questionId}`,
            questionBody,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAnswer = async (
    testId: string,
    questionId: string,
    answerBody: AnswerBody
) => {
    try {
        const response = await instance.patch(
            `/tests/${testId}/questions/${questionId}/answer`,
            {
                ...answerBody,
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTakers = async (
    testId: string,
    takersBody: {
        takers: TakerBodyItf[];
    }
) => {
    try {
        const response = await instance.post(`/tests/${testId}/takers`, {
            takersBody,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAvailableTakers = async (testId: string) => {
    try {
        const response = await instance.get(
            `/tests/${testId}/takers/available`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const assignTakers = async (testId: string, takers: string[]) => {
    try {
        const response = await instance.patch(`/tests/${testId}/takers`, {
            taker_ids: takers,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateQuestions = async (testId: string) => {
    try {
        const response = await instance.get(
            `/tests/${testId}/questions/validate`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const submitAnswers = async (
    testId: string,
    answers: UserAnswer[],
    startTime: Date
) => {
    try {
        const response = await instance.post(`/tests/${testId}/submission`, {
            answers,
            startTime,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSubmission = async (testId: string) => {
    try {
        const response = await instance.get(`/tests/${testId}/submission`);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSubmissions = async (testId: string) => {
    try {
        const response = await instance.get(`/tests/${testId}/submissions`);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTakerAnswer = async (
    testId: string,
    answerId: string,
    answerBody: Pick<AnswerItf, "score">
) => {
    try {
        const response = await instance.patch(
            `/tests/${testId}/answers/${answerId}`,
            answerBody
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
