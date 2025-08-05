import { instance } from "../config/axios";
import {
    AnswerContentItf,
    FilterState,
    GeneratePasscodeBodyItf,
    PartBodyItf,
    PasscodeItf,
    QuestionBodyContentItf,
    QuestionBodyItf,
    TakerBodyItf,
    TestBodyItf,
    TestRequestFilter,
    UserAnswerItf,
} from "../types/types";
import { getQueryString } from "../utils/object";

export const createTest = async (testBody: TestBodyItf) => {
    try {
        const response = await instance.post("/tests", testBody);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTests = async (filter?: FilterState | null) => {
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
    options?: {
        with_user_answers?: boolean;
        passcode?: string;
        started?: boolean;
    }
) => {
    try {
        const response = await instance.get(
            `/tests/${testId}${getQueryString(options)}`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTestByCode = async (
    code: string,
    options?: {
        with_user_answers?: boolean;
        passcode?: string;
        started?: boolean;
    }
) => {
    try {
        const response = await instance.get(
            `/tests/code/${code}${getQueryString(options)}`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTestStatus = async (testId: string) => {
    try {
        const response = await instance.get(`/tests/${testId}`);
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
    partBody: Partial<PartBodyItf>
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

export const movePart = async (
    testId: string,
    partId: string,
    direction: "up" | "down"
) => {
    try {
        const response = await instance.patch(
            `/tests/${testId}/parts/${partId}/move`,
            {
                direction,
            }
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

export const saveQuestion = async (
    testId: string,
    questionBody: QuestionBodyItf<QuestionBodyContentItf>,
    questionId?: string
) => {
    try {
        let response;
        if (!questionId) {
            response = await instance.post(
                `/tests/${testId}/questions`,
                questionBody
            );
        } else {
            response = await instance.patch(
                `/tests/${testId}/questions/${questionId}`,
                questionBody
            );
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reorderQuestions = async (
    testId: string,
    startOrder: number,
    endOrder: number,
    partFromId?: string,
    partToId?: string
) => {
    try {
        const response = await instance.patch(
            `/tests/${testId}/questions/reorder`,
            {
                startOrder,
                endOrder,
                partFromId,
                partToId,
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteQuestion = async (
    testId: string,
    questionId: string,
    questionBody: Partial<QuestionBodyItf<QuestionBodyContentItf>>
) => {
    try {
        const response = await instance.delete(
            `/tests/${testId}/questions/${questionId}`,
            {
                data: questionBody,
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
    answerBody: AnswerContentItf
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

export const createTakersForTest = async (
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

export const getTakersDetails = async (testId: string, takerIds: string[]) => {
    try {
        const response = await instance.post(
            `/tests/${testId}/takers/details`,
            {
                taker_ids: takerIds,
            }
        );

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

export const generatePasscode = async (
    testId: string,
    passcode: GeneratePasscodeBodyItf
) => {
    try {
        const response = await instance.post(
            `/tests/${testId}/passcode/generate`,
            { passcode }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPasscode = async (testId: string, passcode: PasscodeItf) => {
    try {
        const response = await instance.post(`/tests/${testId}/passcode`, {
            passcode,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkPasscode = async (passcode: string) => {
    try {
        const response = await instance.post(`/tests/passcode/check`, {
            passcode,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPasscode = async (testId: string) => {
    try {
        const response = await instance.get(`/tests/${testId}/passcode`);

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
    answers: UserAnswerItf<AnswerContentItf>[],
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

export const getSubmissionAnswers = async (
    testId: string,
    submissionId: string
) => {
    try {
        const response = await instance.get(
            `/tests/${testId}/submissions/${submissionId}/answers`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTakerAnswer = async (
    testId: string,
    answerId: string,
    answerBody: Pick<UserAnswerItf<AnswerContentItf>, "score">
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

export const createTaker = async (body: TakerBodyItf) => {
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
        if (body.group_id) formData.append("group_id", body.group_id);

        const response = await instance.post(`/users/takers`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTaker = async (
    takerId: string,
    body: Partial<TakerBodyItf>
) => {
    try {
        const formData = new FormData();
        if (body.name) {
            formData.append("name", body.name);
        }
        if (body.email) {
            formData.append("email", body.email);
        }
        if (body.gender) formData.append("gender", body.gender);
        if (body.birthday)
            formData.append("birthday", new Date(body.birthday).toISOString());
        if (body.phone_number)
            formData.append("phone_number", body.phone_number);
        if (body.photo) formData.append("file", (body.photo as FileList)[0]);
        if (body.group_id) formData.append("group_id", body.group_id);

        const response = await instance.patch(
            `/users/takers/${takerId}`,
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

export const getQuestionsResultForTest = async (testId: string) => {
    try {
        const response = await instance.get(
            `/tests/${testId}/questions-result`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTestsToImportQuestionToBank = async () => {
    try {
        const response = await instance.get(
            `/tests/tests-for-importing-questions-to-bank`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
