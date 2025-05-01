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
} from "../config/constants/initialValues";
import {
    CREATE_TEST_STEPS,
    MANUAL_SCORE_TYPES,
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
import { reorderQuestions, sortQuestionFn } from "../utils/test";
import { findSmallestMissingPositive } from "../utils/array";
import { TestOptions } from "../types/tests";

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
                state.testDuration = action.payload.duration;
            if (action.payload?.max_score)
                state.maxScore = action.payload.max_score;
            if (action.payload?.num_questions)
                state.numQuestions = action.payload.num_questions;
            if (action.payload?.num_parts)
                state.numParts = action.payload.num_parts;
            if (action.payload?.level) state.level = action.payload.level;
            if (action.payload?.share_option)
                state.shareOption = action.payload.share_option;
            if (action.payload?.public_answers_option)
                if (action.payload?.testId)
                    state.testId = action.payload.testId;
            if (action.payload?.options)
                state.options = JSON.parse(
                    JSON.stringify(action.payload.options)
                );
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
                                test_id: state.testId!,
                                part_id: state.testParts[partIndex].id,
                                order: findSmallestMissingPositive(
                                    partQuestions.map(
                                        (question) => question.order
                                    )
                                ),
                            })
                        ),
                    ];
                } else {
                    state.testParts[partIndex].questions = partQuestions?.slice(
                        0,
                        numQuestions
                    );
                }
                state.testParts[partIndex].questions!.sort(sortQuestionFn);
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
        saveSelectedTestTakers(
            state,
            action: PayloadAction<{ selectedTestTakers: TakerItf[] }>
        ) {
            state.testTakers = action.payload.selectedTestTakers;
        },
        addSelectedTestTakers(state, action: PayloadAction<TakerItf[]>) {
            action.payload.forEach((taker) => {
                if (
                    !state.selectedTestTakers.some(
                        (selectedTaker) => selectedTaker.email === taker.email
                    )
                ) {
                    state.selectedTestTakers.push(taker);
                } else {
                    state.selectedTestTakers = state.selectedTestTakers.filter(
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
                            state?.testQuestions?.length;
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
                partId?: string;
            }>
        ) {
            const { startIndex, endIndex, partId } = action.payload;

            if (partId) {
                const partIndex = state.testParts.findIndex(
                    (part) => part.id === partId
                );
                const partQuestions = state.testParts[partIndex].questions;
                if (!partQuestions) return;

                state.testParts[partIndex].questions = reorderQuestions(
                    partQuestions,
                    startIndex,
                    endIndex
                );
            } else {
                state.testQuestions = reorderQuestions(
                    state.testQuestions,
                    startIndex,
                    endIndex
                );
            }
        },
        // handleReorderQuestions(state, action) {
        //     if (action.payload.part_id) {
        //         const partIndex = state.testParts.findIndex(
        //             (part) => part.id === action.payload.question.part_id
        //         );
        //         const partQuestions = state.testParts[partIndex].questions;
        //         if (!partQuestions) return;
        //         partQuestions.sort(sortQuestionFn);
        //         state.testParts[partIndex].questions = partQuestions;
        //     } else {
        //         state.testQuestions.sort(sortQuestionFn);
        //     }
        // },
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
                            answer = {
                                ...question?.content?.answer,
                                is_saved: true,
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
                    part.questions.sort(sortQuestionFn);
                }
                return part;
            });

            state.testQuestions = action.payload?.questions
                ? action.payload?.questions.sort(sortQuestionFn)
                : [];
            state.testTakers = action.payload.test.taker_ids;

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
        setPasscode(state, action: PayloadAction<PasscodeItf>) {
            state.passcode = action.payload;
            if (action.payload.valid_in) {
                action.payload.valid_till = new Date(
                    Date.now() + action.payload.valid_in * 1000 * 60
                ).toISOString();
            }
            if (action.payload.valid_till) {
                action.payload.valid_in = Math.round(
                    (new Date(action.payload.valid_till).getTime() -
                        Date.now()) /
                        1000 /
                        60
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
