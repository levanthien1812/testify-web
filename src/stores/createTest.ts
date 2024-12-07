import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    INITIAL_CREATE_TEST_CONTEXT,
    INITIAL_FILL_GAPS_QUESTION,
    INITIAL_MATCHING_QUESTION,
    INITIAL_MULTIPLE_CHOICES_QUESTION,
    INITIAL_PART,
    INITIAL_QUESTION,
    INITIAL_RESPONSE_QUESTION,
} from "../config/constants/initialValues";
import { CREATE_TEST_STEPS, QUESTION_TYPE } from "../config/constants/tests";
import { QuestionItf, TakerItf, TestPartItf } from "../types/types";

const createTestSlice = createSlice({
    initialState: INITIAL_CREATE_TEST_CONTEXT,
    name: "createTest",
    reducers: {
        checkStep(state, action) {
            const isValidStep = state.steps?.find(
                (step) => step.value === action.payload.step
            );
            if (!isValidStep) state.currentStep = state.steps?.[0].value;
        },
        setStep(
            state,
            action: PayloadAction<
                (typeof CREATE_TEST_STEPS)[keyof typeof CREATE_TEST_STEPS]
            >
        ) {
            state.currentStep = action.payload;
        },
        moveNextStep(state) {
            const currentStep = state.steps?.find(
                (step) => step.value === state.currentStep
            );
            if (!currentStep) return;
            if (currentStep?.index === state.steps?.length) {
                state.enableNextStep = false;
                return;
            }
            const next_step = state.steps?.find(
                (step) => step.index === currentStep?.index + 1
            );
            state.currentStep = next_step ? next_step.value : "";
        },
        movePrevStep(state) {
            const currentStep = state.steps?.find(
                (step) => step.value === state.currentStep
            );
            if (!currentStep) return;
            if (currentStep?.index === 0) {
                state.enablePrevStep = false;
                return;
            }
            const prev_step = state.steps?.find(
                (step) => step.index === currentStep?.index - 1
            );
            state.currentStep = prev_step ? prev_step.value : "";
        },
        saveTestInfo(state, action) {
            if (action.payload?.title) state.testTitle = action.payload.title;
            if (action.payload?.datetime)
                state.testDatetime = action.payload.datetime;
            if (action.payload?.description)
                state.testDescription = action.payload.description;
            if (action.payload?.duration)
                state.testDuration = action.payload.duration;
            if (action.payload?.max_score)
                state.maxScore = action.payload.max_score;
            if (action.payload?.num_questions)
                state.numQuestions = action.payload.num_questions;
            if (action.payload?.num_parts)
                state.numParts = action.payload.num_parts;
            if (action.payload?.level) state.level = action.payload.level;
            if (action.payload?.code) state.code = action.payload.code;
            if (action.payload?.enable_close_time)
                state.enableCloseTime = action.payload.enable_close_time;
            if (action.payload?.close_time)
                state.closeTime = action.payload.close_time;
            if (action.payload?.share_option)
                state.shareOption = action.payload.share_option;
            if (action.payload?.public_answers_option)
                state.publicAnswersOption =
                    action.payload.public_answers_option;
            if (action.payload?.public_answers_date)
                state.publicAnswersDate = action.payload.public_answers_date;
            if (action.payload?.testId) state.testId = action.payload.testId;
        },
        initializeTestParts(state) {
            const countProvidedParts = state.testParts.filter(
                (part) => part.id
            ).length;
            if (state.numParts > 1 && countProvidedParts === 0) {
                state.testParts = [...Array(state?.numParts)].map(
                    (item, index) => ({ ...INITIAL_PART, order: index + 1 })
                );
            }
            if (state.numParts > state.testParts.length) {
                state.testParts = [
                    ...state.testParts,
                    ...[...Array(state.numParts - state.testParts.length)].map(
                        (item, index) => ({
                            ...INITIAL_PART,
                            order: state.testParts.length + (index + 1),
                        })
                    ),
                ];
            }
        },
        saveTestParts(
            state,
            action: PayloadAction<{
                partOrder: number;
                partInfo: Partial<TestPartItf>;
            }>
        ) {
            const partIndex = state.testParts.findIndex(
                (part) => part.order === action.payload.partOrder
            );
            state.testParts[partIndex] = {
                ...state.testParts[partIndex],
                ...action.payload.partInfo,
            };

            // Initialize part questions
            if (
                action.payload.partInfo?.num_questions &&
                state?.testQuestions?.length === 0 &&
                (state.testParts[partIndex]?.questions?.length === 0 ||
                    !state.testParts[partIndex]?.questions)
            ) {
                state.testParts[partIndex].questions = [
                    ...Array(action.payload.partInfo?.num_questions),
                ].map((item, index) => ({
                    ...INITIAL_QUESTION,
                    order: index + 1,
                }));
            }

            if (
                action.payload.partInfo?.id &&
                state.testParts[partIndex]?.questions
            ) {
                state.testParts[partIndex].questions?.map((question) => ({
                    ...question,
                    part_id: action.payload.partInfo.id,
                }));
            }
        },
        saveTestQuestions(
            state,
            action: PayloadAction<{
                partId?: string;
                questionOrder: number;
                questionInfo: Partial<QuestionItf>;
            }>
        ) {
            const getInitialQuestionContent = (type: string) => {
                switch (type) {
                    case QUESTION_TYPE.MULTIPLE_CHOICES:
                        return INITIAL_MULTIPLE_CHOICES_QUESTION;

                    case QUESTION_TYPE.FILL_IN_THE_GAPS:
                        return INITIAL_FILL_GAPS_QUESTION;

                    case QUESTION_TYPE.MATCHING:
                        return INITIAL_MATCHING_QUESTION;

                    case QUESTION_TYPE.RESPONSE:
                        return INITIAL_RESPONSE_QUESTION;
                }
            };
            if (action.payload?.partId) {
                const partIndex = state.testParts.findIndex(
                    (part) => part.id === action.payload.partId
                );
                const partQuestions = state.testParts[partIndex].questions;
                if (!partQuestions) return;
                const questionIndex = partQuestions.findIndex(
                    (question) =>
                        question.order === action.payload.questionOrder
                );
                const question = partQuestions[questionIndex];
                if (!question) return;

                state.testParts[partIndex].questions![questionIndex] = {
                    ...question,
                    ...action.payload.questionInfo,
                };
                if (action.payload?.questionInfo?.type && !question.content) {
                    state.testParts[partIndex].questions![
                        questionIndex
                    ].content = getInitialQuestionContent(
                        action.payload.questionInfo?.type
                    );
                }
                if (action.payload?.questionInfo?.content) {
                    state.testParts[partIndex].questions![
                        questionIndex
                    ].content = {
                        ...(question.content as any),
                        ...JSON.parse(
                            JSON.stringify(
                                action.payload?.questionInfo?.content as any
                            )
                        ),
                    };
                }
            } else {
                const questionIndex = state.testQuestions.findIndex(
                    (question) =>
                        question.order === action.payload.questionOrder
                );
                const question = state.testQuestions[questionIndex];
                if (!question) return;

                state.testQuestions![questionIndex] = {
                    ...question,
                    ...action.payload.questionInfo,
                };
                if (
                    action.payload?.questionInfo?.type &&
                    !question.content &&
                    action.payload?.questionInfo.type !== question.type
                ) {
                    state.testQuestions[questionIndex].content =
                        getInitialQuestionContent(
                            action.payload.questionInfo?.type
                        );
                }
                if (action.payload?.questionInfo?.content) {
                    state.testQuestions[questionIndex].content = {
                        ...(question.content as any),
                        ...JSON.parse(
                            JSON.stringify(
                                action.payload?.questionInfo?.content as any
                            )
                        ),
                    };
                }
            }
        },
        saveTestAnswers(state, action) {},
        saveTestTakers(
            state,
            action: PayloadAction<{ testTakers: TakerItf[] }>
        ) {
            state.testTakers = action.payload.testTakers;
        },
        addTestTakers(state, action: PayloadAction<TakerItf[]>) {
            action.payload.forEach((taker) => {
                if (
                    !state.testTakers.some(
                        (selectedTaker) => selectedTaker.email === taker.email
                    )
                ) {
                    state.testTakers.push(taker);
                } else {
                    state.testTakers = state.testTakers.filter(
                        (selectedTaker) => selectedTaker.email !== taker.email
                    );
                }
            });
        },
        setAvailableTakers(state, action: PayloadAction<TakerItf[]>) {
            state.availableTakers = action.payload;
        },
        validate(state) {
            // Validation
            switch (state.currentStep) {
                case CREATE_TEST_STEPS.TEST_INFORMATION: {
                    state.isValidTestInfo =
                        state.testTitle.length > 0 &&
                        state.testDatetime.length > 0 &&
                        state.testDuration > 0 &&
                        state.maxScore > 0 &&
                        state.numQuestions > 0 &&
                        state.numParts > 0;
                    break;
                }
                case CREATE_TEST_STEPS.TEST_PARTS: {
                    if (state?.testParts?.length > 0) {
                        let isEqualTotalScores = false;
                        const totalPartsScores = state?.testParts?.reduce(
                            (total, curr) => curr.score + total,
                            0
                        );
                        if (totalPartsScores === state?.maxScore) {
                            isEqualTotalScores = true;
                        }
                        state.isValidParts = isEqualTotalScores;
                    }
                    break;
                }
                case CREATE_TEST_STEPS.TEST_QUESTIONS: {
                    if (state?.testParts?.length > 0) {
                        state.isValidQuestions = state?.testParts?.every(
                            (part) => {
                                let isEqualTotalScores = false;
                                let isEqualNumberQuestions = false;
                                const totalQuestionsScore =
                                    part?.questions?.reduce(
                                        (total, curr) => curr.score + total,
                                        0
                                    );
                                if (totalQuestionsScore === part?.score) {
                                    isEqualTotalScores = true;
                                }
                                const totalQuestionsNumber =
                                    part?.questions?.length;
                                if (
                                    totalQuestionsNumber === part.num_questions
                                ) {
                                    isEqualNumberQuestions = true;
                                }
                                return (
                                    isEqualTotalScores && isEqualNumberQuestions
                                );
                            }
                        );
                    } else {
                        let isEqualTotalScores = false;
                        let isEqualNumberQuestions = false;
                        const totalQuestionsScore =
                            state?.testQuestions?.reduce(
                                (total, curr) => curr.score + total,
                                0
                            );
                        if (totalQuestionsScore === state?.maxScore) {
                            isEqualTotalScores = true;
                        }
                        const totalQuestionsNumber =
                            state?.testQuestions?.length;
                        if (totalQuestionsNumber === state?.numQuestions) {
                            isEqualNumberQuestions = true;
                        }
                        state.isValidQuestions =
                            isEqualTotalScores && isEqualNumberQuestions;
                    }
                    break;
                }
            }
        },
        validateCurrentPart(
            state,
            action: PayloadAction<{ partIndex: number }>
        ) {
            const currentPart = state.testParts[action.payload.partIndex];
            if (
                currentPart?.name?.length === 0 ||
                (currentPart?.num_questions &&
                    currentPart.num_questions > state?.numQuestions) ||
                (currentPart?.num_questions && currentPart.num_questions <= 0)
            ) {
                state.isValidCurrentPart = false;
            } else {
                state.isValidCurrentPart = true;
            }
        },
        setTestFromAPI(state, action) {
            console.log(action);
            state.testTitle = action.payload?.title;
            state.testDatetime = action.payload?.datetime;
            state.testDescription = action.payload?.description;
            state.testDuration = action.payload?.duration;
            state.maxScore = action.payload?.max_score;
            state.numQuestions = action.payload?.num_questions;
            state.numParts = action.payload?.num_parts;
            state.level = action.payload?.level;
            state.code = action.payload?.code;
            state.enableCloseTime = action.payload?.enable_close_time;
            state.closeTime = action.payload?.close_time;
            state.shareOption = action.payload?.share_option;
            state.publicAnswersOption = action.payload?.public_answers_option;
            state.publicAnswersDate = action.payload?.public_answers_date;
            state.testId = action.payload?.id;

            state.testParts = action.payload?.parts as Pick<
                TestPartItf,
                keyof TestPartItf
            >[];
            // Initialize part questions
            state.testParts?.map((part) => {
                if (
                    part?.num_questions > 0 &&
                    (part?.questions?.length === 0 || !part?.questions)
                ) {
                    part.questions = [...Array(part?.num_questions)].map(
                        (item, index) => ({
                            ...INITIAL_QUESTION,
                            order: index + 1,
                        })
                    );
                }
                return part;
            });
            state.testQuestions = action.payload?.questions;
            state.testTakers = action.payload?.taker_ids;
        },
    },
});

export const createTestReducer = createTestSlice.reducer;
export const createTestActions = createTestSlice.actions;
