import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    DRAFT_EDITIBILITY_CONFIG,
    PUBLISHED_EDITABILITY_CONFIG,
    OPENED_EDITABILITY_CONFIG,
    CLOSED_EDITABILITY_CONFIG,
    INITIAL_CREATE_TEST_CONTEXT,
    INITIAL_PART,
    INITIAL_QUESTION,
    INITIAL_OPTIONS,
    INITIAL_PASSCODE,
} from "../config/constants/initialValues";
import {
    CREATE_TEST_STEPS,
    MANUAL_SCORE_TYPES,
    MILISECONDS_BY_UNIT,
    TEST_STATUS,
} from "../config/constants/tests";
import {
    PasscodeItf,
    QuestionContentItf,
    QuestionItf,
    TakerItf,
    TestItf,
    TestPartItf,
} from "../types/types";
import { SHARE_OPTIONS } from "../config/constants/tests";
import { PASSCODE_FORMAT, PASSCODE_METHOD } from "../config/constants/passcode";
import {
    addQuestion,
    checkQuestionAnswerIsSaved,
    removeQuestion,
    reorderQuestions,
    sortByOrderFn,
} from "../utils/test";
import { findSmallestMissingPositive } from "../utils/array";

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
        setStep(state, action: PayloadAction<CREATE_TEST_STEPS>) {
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
                state.testDuration = parseInt(action.payload.duration);
            if (action.payload?.max_score)
                state.maxScore = parseFloat(action.payload.max_score);
            if (action.payload?.num_questions)
                state.numQuestions = action.payload.num_questions;
            if (action.payload?.num_parts)
                state.numParts = action.payload.num_parts;
            if (action.payload?.level) state.level = action.payload.level;
            if (action.payload?.share_option)
                state.shareOption = action.payload.share_option;

            if (action.payload?.testId) state.testId = action.payload.testId;
            if (action.payload?.options)
                state.options = JSON.parse(
                    JSON.stringify(action.payload.options)
                );
        },
        initializeTestParts(state) {
            const countProvidedParts = state?.testParts?.filter(
                (part) => part?.id
            )?.length;

            if (state.numParts > 1 && countProvidedParts === 0) {
                state.testParts = [...Array(state?.numParts)].map(
                    (item, index) => ({ ...INITIAL_PART, order: index + 1 })
                );
            }
            if (countProvidedParts > 0 && state.testParts) {
                state.testParts.sort(sortByOrderFn);
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

            if (action.payload.partInfo?.is_saved) {
                state.testParts[partIndex].is_saved = true;
            } else {
                state.testParts[partIndex].is_saved = false;
            }
        },
        movePart(
            state,
            action: PayloadAction<{ partId: string; direction: "up" | "down" }>
        ) {
            let updatedParts = [...state.testParts];
            const partToMoveIndex = state.testParts.findIndex(
                (part) => part.id === action.payload.partId
            );
            if (partToMoveIndex === -1) return;

            if (action.payload.direction === "up") {
                const partAboveIndex = state.testParts.findIndex(
                    (part) =>
                        part.order === updatedParts[partToMoveIndex].order - 1
                );
                if (partAboveIndex === -1) return;
                updatedParts[partToMoveIndex].order =
                    updatedParts[partAboveIndex].order;
                updatedParts[partAboveIndex].order =
                    updatedParts[partToMoveIndex].order + 1;
            } else {
                const partBelowIndex = state.testParts.findIndex(
                    (part) =>
                        part.order === updatedParts[partToMoveIndex].order + 1
                );
                if (partBelowIndex === -1) return;
                updatedParts[partToMoveIndex].order =
                    updatedParts[partBelowIndex].order;
                updatedParts[partBelowIndex].order =
                    updatedParts[partToMoveIndex].order - 1;
            }

            updatedParts.sort(sortByOrderFn);
            state.testParts = updatedParts;
        },
        initializeTestQuestions(state) {
            if (state.numParts > 1) {
                state.testParts = state.testParts?.map((part) => {
                    if (!part.questions || part.questions.length === 0) {
                        part.questions = [...Array(part.num_questions)].map(
                            (question, index) => {
                                return {
                                    ...INITIAL_QUESTION,
                                    test_id: state.testId!,
                                    part_id: part.id,
                                    order: index + 1,
                                };
                            }
                        );
                    } else {
                        if (part.questions.length < part.num_questions) {
                            let orderArray = part.questions.map(
                                (question) => question.order
                            );

                            part.questions = [
                                ...part.questions,
                                ...[
                                    ...Array(
                                        part.num_questions -
                                            part.questions.length
                                    ),
                                ].map((item, index) => {
                                    const missingOrder =
                                        findSmallestMissingPositive(orderArray);
                                    orderArray.push(missingOrder);
                                    return {
                                        ...INITIAL_QUESTION,
                                        test_id: state.testId!,
                                        part_id: part.id,
                                        order: missingOrder,
                                    };
                                }),
                            ];
                        }

                        part.questions = part.questions.map((question) => {
                            let answer = {};
                            if (question?.content?.answer) {
                                answer = {
                                    ...question?.content?.answer,
                                    is_saved:
                                        checkQuestionAnswerIsSaved(question),
                                };
                            }
                            return {
                                ...question,
                                content: {
                                    ...question.content,
                                    answer: answer,
                                } as QuestionContentItf,
                            };
                        });

                        part.questions.sort(sortByOrderFn);
                    }
                    return part;
                });
            } else {
                if (state.testQuestions?.length === 0) {
                    state.testQuestions = [...Array(state.numQuestions)].map(
                        (question, index) => {
                            return {
                                ...INITIAL_QUESTION,
                                test_id: state.testId!,
                                order: index + 1,
                            };
                        }
                    );
                } else {
                    let orderArray = state.testQuestions.map(
                        (question) => question.order
                    );

                    state.testQuestions = [
                        ...state.testQuestions,
                        ...[
                            ...Array(
                                state.numQuestions - state.testQuestions?.length
                            ),
                        ].map((item, index) => {
                            const missingOrder =
                                findSmallestMissingPositive(orderArray);
                            orderArray.push(missingOrder);
                            return {
                                ...INITIAL_QUESTION,
                                test_id: state.testId!,
                                order: missingOrder,
                            };
                        }),
                    ];
                }
                state.testQuestions.sort(sortByOrderFn);
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

                state.testQuestions[questionIndex] = {
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
        initializeTestAnswers(state) {
            if (state.numParts > 1) {
                state.testParts.map((part) => {
                    if (part.questions) {
                        part.questions.map((question) => {
                            if (question.content && question.content.answer) {
                                question.content.answer.is_saved =
                                    checkQuestionAnswerIsSaved(question);
                            }
                            return question;
                        });
                    }
                    return part;
                });
            } else {
                state.testQuestions.map((question) => {
                    if (question.content && question.content.answer) {
                        question.content.answer.is_saved =
                            checkQuestionAnswerIsSaved(question);
                    }
                    return question;
                });
            }
        },
        saveTestAnswers(state, action) {},
        saveSelectedTestTakers(state, action: PayloadAction<TakerItf[]>) {
            state.selectedTestTakers = action.payload;
        },
        removeSelectedTestTakers(state, action: PayloadAction<TakerItf>) {
            state.selectedTestTakers = state.selectedTestTakers.filter(
                (selectedTaker) => selectedTaker.id !== action.payload.id
            );
        },
        setAvailableTakers(state, action: PayloadAction<TakerItf[]>) {
            state.availableTakers = action.payload;
        },
        validate(
            state,
            action: PayloadAction<{ step: CREATE_TEST_STEPS } | undefined>
        ) {
            const step = action.payload?.step || state.currentStep;
            switch (step) {
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
                    if (state.numParts <= 1) state.isValidParts = true;
                    else {
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
                    if (state?.numParts > 1) {
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

                        state.includesManuallyScoredQuestions =
                            state.testParts.some((part) => {
                                return part.questions?.some((question) =>
                                    MANUAL_SCORE_TYPES.includes(question.type)
                                );
                            });
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
                            state?.testQuestions?.filter(
                                (question) => question.is_content_provided
                            ).length;

                        if (totalQuestionsNumber === state?.numQuestions) {
                            isEqualNumberQuestions = true;
                        }
                        state.isValidQuestions =
                            isEqualTotalScores && isEqualNumberQuestions;

                        state.includesManuallyScoredQuestions =
                            state.testQuestions.some((question) =>
                                MANUAL_SCORE_TYPES.includes(question.type)
                            );
                    }
                    break;
                }
                case CREATE_TEST_STEPS.TEST_ANSWERS: {
                    break;
                }
                case CREATE_TEST_STEPS.TEST_TAKERS: {
                    state.isValidShareOption = false;
                    switch (state.shareOption) {
                        case SHARE_OPTIONS.RESTRICTED: {
                            if (state.selectedTestTakers.length > 0) {
                                state.isValidShareOption = true;
                            }
                            break;
                        }
                        case SHARE_OPTIONS.ANYONE: {
                            state.isValidShareOption = true;
                            break;
                        }
                        case SHARE_OPTIONS.PASSCODE: {
                            if (
                                state.passcode.method ===
                                    PASSCODE_METHOD.AUTO_GENERATED &&
                                state.passcode.format &&
                                state.passcode.code
                            ) {
                                state.isValidShareOption = true;
                            }
                            if (
                                state.passcode.method ===
                                    PASSCODE_METHOD.MANUALLY_ENTERED &&
                                state.passcode.code
                            ) {
                                state.isValidShareOption = true;
                            }
                            break;
                        }
                    }
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
        handleReorderQuestion(
            state,
            action: PayloadAction<{
                startIndex: number;
                endIndex: number;
                partFromId?: string;
                partToId?: string;
            }>
        ) {
            const { startIndex, endIndex, partFromId, partToId } =
                action.payload;

            if (partFromId && partToId) {
                const partFromIndex = state.testParts.findIndex(
                    (part) => part.id === partFromId
                );
                const partFromQuestions =
                    state.testParts[partFromIndex].questions;
                if (!partFromQuestions) return;

                if (partFromId === partToId) {
                    state.testParts[partFromIndex].questions = reorderQuestions(
                        partFromQuestions,
                        startIndex,
                        endIndex
                    );
                } else {
                    const partToIndex = state.testParts.findIndex(
                        (part) => part.id === partToId
                    );
                    const partToQuestions =
                        state.testParts[partToIndex].questions;
                    if (!partToQuestions) return;

                    const questionToAdd = partFromQuestions[startIndex];
                    questionToAdd.part_id = partToId;
                    questionToAdd.order = endIndex + 1;

                    state.testParts[partToIndex].questions = addQuestion(
                        partToQuestions,
                        questionToAdd,
                        endIndex
                    );

                    state.testParts[partFromIndex].questions = removeQuestion(
                        partFromQuestions,
                        startIndex
                    );

                    state.testParts[partFromIndex].num_questions -= 1;
                    state.testParts[partToIndex].num_questions += 1;
                }
            } else {
                state.testQuestions = reorderQuestions(
                    state.testQuestions,
                    startIndex,
                    endIndex
                );
            }
        },
        setTestFromAPI(
            state,
            action: PayloadAction<{
                test: TestItf;
                parts: TestPartItf[];
                questions: QuestionItf<QuestionContentItf>[];
            }>
        ) {
            state.testTitle = action.payload.test.title;
            state.testDatetime = action.payload.test.datetime;
            state.testDescription = action.payload.test.description;
            state.testDuration = action.payload.test.duration;
            state.maxScore = action.payload.test.max_score;
            state.numQuestions = action.payload.test.num_questions;
            state.numParts = action.payload.test.num_parts;
            state.level = action.payload.test.level;
            state.shareOption =
                action.payload.test.share_option || SHARE_OPTIONS.RESTRICTED;
            state.testId = action.payload.test.id;
            state.status = action.payload.test.status;
            state.passcode = action.payload.test.passcode || INITIAL_PASSCODE;

            state.testParts = action.payload?.parts;
            state.testParts = state.testParts.map((part) => ({
                ...part,
                is_saved: part?.id ? true : false,
            }));

            state.selectedTestTakers = action.payload.test.takers;

            switch (state.status) {
                case TEST_STATUS.DRAFT: {
                    state.editibility = DRAFT_EDITIBILITY_CONFIG;
                    break;
                }
                case TEST_STATUS.PUBLISHED: {
                    state.editibility = PUBLISHED_EDITABILITY_CONFIG;
                    break;
                }
                case TEST_STATUS.OPENED: {
                    state.editibility = OPENED_EDITABILITY_CONFIG;
                    break;
                }
                case TEST_STATUS.CLOSED: {
                    state.editibility = CLOSED_EDITABILITY_CONFIG;
                    break;
                }
            }

            if (action.payload.questions) {
                state.testQuestions = action.payload.questions;
            }

            state.includesManuallyScoredQuestions =
                action.payload.test.includes_manually_scored_questions || false;

            // state.options = action.payload.test.options || INITIAL_OPTIONS;
            state.options = {
                ...INITIAL_OPTIONS,
                ...action.payload.test.options,
            };
        },
        reset(state) {
            return INITIAL_CREATE_TEST_CONTEXT;
        },
        navigateStep(step) {},
        generateTestLink(state) {
            state.testLink = `${window.location.origin}/tests/${state.testId}`;
        },
        setPasscode(state, action: PayloadAction<Partial<PasscodeItf>>) {
            state.passcode = { ...state.passcode, ...action.payload };

            if (action.payload.valid_in && state.passcode.valid_unit) {
                state.passcode.valid_till = new Date(
                    Date.now() +
                        action.payload.valid_in *
                            MILISECONDS_BY_UNIT[state.passcode.valid_unit]
                ).toISOString();
            }
            if (state.passcode.valid_in && action.payload.valid_unit) {
                state.passcode.valid_till = new Date(
                    Date.now() +
                        state.passcode.valid_in *
                            MILISECONDS_BY_UNIT[action.payload.valid_unit]
                ).toISOString();
            }

            if (action.payload.valid_till && state.passcode.valid_unit) {
                state.passcode.valid_in = Math.round(
                    (new Date(action.payload.valid_till).getTime() -
                        Date.now()) /
                        MILISECONDS_BY_UNIT[state.passcode.valid_unit]
                );
            }
            if (state.passcode.valid_till && action.payload.valid_unit) {
                state.passcode.valid_in = Math.round(
                    (new Date(state.passcode.valid_till).getTime() -
                        Date.now()) /
                        MILISECONDS_BY_UNIT[action.payload.valid_unit]
                );
            }

            if (
                action.payload.method === PASSCODE_METHOD.AUTO_GENERATED &&
                !state.passcode.format
            ) {
                state.passcode.format = PASSCODE_FORMAT["XXX-YYY"];
            }
        },
        deleteQuestion(state, action) {
            const question = action.payload;

            state.numQuestions = state.numQuestions - 1;

            if (question?.part_id) {
                state.testParts = state.testParts?.map((part) => {
                    if (part.id === question?.part_id) {
                        part.num_questions = part.num_questions - 1;
                    }

                    part.questions = part.questions
                        ?.filter((ques) => ques.id !== question.id)
                        .map((ques) => {
                            if (ques.order > question.order) {
                                ques.order = ques.order - 1;
                            }
                            return ques;
                        });

                    return part;
                });
            }

            state.testQuestions = state.testQuestions?.filter(
                (ques) => ques.id !== question.id
            );

            state.currentStep = CREATE_TEST_STEPS.TEST_PARTS;
        },
        handleNavigation(state, action) {
            switch (action.payload) {
                case CREATE_TEST_STEPS.TEST_INFORMATION: {
                    state.currentStep = CREATE_TEST_STEPS.TEST_INFORMATION;
                    break;
                }
                case CREATE_TEST_STEPS.TEST_PARTS: {
                    if (state.isValidTestInfo) {
                        state.currentStep = CREATE_TEST_STEPS.TEST_PARTS;
                    }
                    break;
                }
                case CREATE_TEST_STEPS.TEST_QUESTIONS: {
                    if (state.isValidParts) {
                        state.currentStep = CREATE_TEST_STEPS.TEST_QUESTIONS;
                    }
                    break;
                }
                case CREATE_TEST_STEPS.TEST_ANSWERS: {
                    if (state.isValidQuestions) {
                        state.currentStep = CREATE_TEST_STEPS.TEST_ANSWERS;
                    }
                    break;
                }
                case CREATE_TEST_STEPS.TEST_TAKERS: {
                    state.currentStep = CREATE_TEST_STEPS.TEST_TAKERS;
                    break;
                }
            }
        },
    },
});

export const createTestReducer = createTestSlice.reducer;
export const createTestActions = createTestSlice.actions;
