import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    INITIAL_CREATE_TEST_CONTEXT,
    INITIAL_PART,
    INITIAL_QUESTION,
} from "../config/constants/initialValues";
import { CREATE_TEST_STEPS, QUESTION_TYPE } from "../config/constants/tests";
import {
    QuestionContentItf,
    QuestionItf,
    TakerItf,
    TestPartItf,
} from "../types/types";

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
            console.log(state);
            const countProvidedParts = state?.testParts?.filter(
                (part) => part?.id
            )?.length;
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
            const numQuestions = action.payload.partInfo?.num_questions;
            const partQuestions = state.testParts[partIndex].questions;
            if (
                numQuestions &&
                (!state.testQuestions || state?.testQuestions?.length === 0)
            ) {
                if (partQuestions?.length === 0 || !partQuestions) {
                    state.testParts[partIndex].questions = [
                        ...Array(numQuestions),
                    ].map((item, index) => ({
                        ...INITIAL_QUESTION,
                        order: index + 1,
                    }));
                } else if (partQuestions?.length < numQuestions) {
                    state.testParts[partIndex].questions = [
                        ...partQuestions,
                        ...[...Array(numQuestions - partQuestions?.length)].map(
                            (item, index) => ({
                                ...INITIAL_QUESTION,
                                order: partQuestions?.length + index + 1,
                            })
                        ),
                    ];
                } else {
                    state.testParts[partIndex].questions = partQuestions?.slice(
                        0,
                        numQuestions
                    );
                }
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

            if (action.payload.partInfo?.is_saved) {
                state.testParts[partIndex].is_saved = true;
            } else {
                state.testParts[partIndex].is_saved = false;
            }
        },
        saveTestQuestions(
            state,
            action: PayloadAction<{
                partId?: string;
                questionOrder: number;
                questionInfo: Partial<QuestionItf<QuestionContentItf>>;
            }>
        ) {
            console.log(action.payload.questionInfo);
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

                if (
                    action.payload?.questionInfo?.content &&
                    !action.payload?.questionInfo?.type
                ) {
                    state.testParts[partIndex].questions![questionIndex] = {
                        ...state.testParts[partIndex].questions![questionIndex],
                        content: action.payload?.questionInfo?.content,
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
                if (action.payload?.questionInfo?.content) {
                    state.testQuestions[questionIndex] = {
                        ...state.testQuestions[questionIndex],
                        content: action.payload?.questionInfo?.content,
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
                        let isEqualNumberQuestions = false;
                        const totalPartsScores = state?.testParts?.reduce(
                            (total, curr) => curr.score + total,
                            0
                        );
                        if (
                            totalPartsScores === state?.maxScore &&
                            state?.testParts?.every(
                                (part) => part.num_questions > 0
                            )
                        ) {
                            isEqualTotalScores = true;
                        }

                        const totalPartsQuestions = state?.testParts?.reduce(
                            (total, curr) => total + curr?.num_questions,
                            0
                        );
                        if (
                            totalPartsQuestions === state?.numQuestions &&
                            state?.testParts?.every(
                                (part) => part.num_questions > 0
                            )
                        ) {
                            isEqualNumberQuestions = true;
                        }
                        console.log(totalPartsScores, totalPartsQuestions);
                        state.isValidParts =
                            isEqualTotalScores && isEqualNumberQuestions;
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

            state.testParts = action.payload?.parts;
            state.testParts = state.testParts.map((part) => ({
                ...part,
                is_saved: part?.id ? true : false,
            }));

            // Initialize part questions
            state.testParts = state.testParts?.map((part) => {
                if (
                    part?.num_questions > 0 &&
                    (part?.questions?.length === 0 || !part?.questions)
                ) {
                    part.questions = [...Array(part?.num_questions)].map(
                        (question, index) => {
                            return {
                                ...INITIAL_QUESTION,
                                order: index + 1,
                            };
                        }
                    );
                }
                if (part.questions && part.questions.length > 0) {
                    part.questions = part.questions.map((question) => {
                        let answer = {};
                        if (question?.content?.answer) {
                            switch (question.type) {
                                case QUESTION_TYPE.MULTIPLE_CHOICES:
                                    answer = {
                                        options: question?.content?.answer,
                                        is_saved: true,
                                    };
                                    break;
                                case QUESTION_TYPE.FILL_IN_THE_GAPS:
                                    answer = {
                                        gaps: question?.content?.answer,
                                        is_saved: true,
                                    };
                                    break;
                                case QUESTION_TYPE.MATCHING:
                                    answer = {
                                        matchings: question?.content?.answer,
                                        is_saved: true,
                                    };
                                    break;
                                case QUESTION_TYPE.RESPONSE:
                                    answer = {
                                        response: question?.content?.answer,
                                        is_saved: true,
                                    };
                                    break;
                                default:
                                    break;
                            }
                        }
                        return {
                            ...question,
                            content: {
                                ...question.content,
                                answer: answer,
                            } as QuestionContentItf,
                        };
                    });
                }
                return part;
            });

            state.testQuestions = action.payload?.questions;
            state.testTakers = action.payload?.taker_ids;
        },
        reset(state) {
            return INITIAL_CREATE_TEST_CONTEXT;
        },
    },
});

export const createTestReducer = createTestSlice.reducer;
export const createTestActions = createTestSlice.actions;
