import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    DRAFT_EDITIBILITY_CONFIG,
    PUBLISHED_EDITABILITY_CONFIG,
    OPENED_EDITABILITY_CONFIG,
    CLOSED_EDITABILITY_CONFIG,
    INITIAL_CREATE_TEST_CONTEXT,
    INITIAL_OPTIONS,
    INITIAL_PASSCODE,
} from "../config/constants/initialValues";
import {
    CREATE_TEST_STEPS,
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
    changeIntermediateQuestionsOrder,
    removeQuestion,
    reorderQuestions,
    sortByOrderFn,
} from "../utils/test";
import {
    initializeAnswers,
    initializeParts,
    initializeQuestions,
    validateAnswers,
    validateParts,
    validateQuestions,
    validateShareOption,
    validateTestInfo,
} from "./actionFns/createTest";

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
            state.testParts = initializeParts(
                state.testParts,
                state.numParts,
                state.testId!
            );
        },
        saveTestParts(state, action: PayloadAction<Partial<TestPartItf>>) {
            if (!action.payload.order) return;
            const partIndex = state.testParts.findIndex(
                (part) => part.order === action.payload.order
            );
            state.testParts[partIndex] = {
                ...state.testParts[partIndex],
                ...action.payload,
            };

            if (action.payload?.is_saved) {
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
                let startOrder = 1;
                state.testParts = state.testParts?.map((part) => {
                    const questions = initializeQuestions(
                        part.questions || [],
                        part.num_questions,
                        state.testId!,
                        part.id,
                        startOrder
                    );

                    startOrder += questions.length;

                    return {
                        ...part,
                        questions,
                    };
                });
            } else {
                state.testQuestions = initializeQuestions(
                    state.testQuestions,
                    state.numQuestions,
                    state.testId!
                );
            }
        },

        saveTestQuestions(
            state,
            action: PayloadAction<Partial<QuestionItf<QuestionContentItf>>>
        ) {
            if (!action.payload.order) return;
            if (action.payload?.part_id) {
                const partIndex = state.testParts.findIndex(
                    (part) => part.id === action.payload.part_id
                );
                const partQuestions = state.testParts[partIndex].questions;
                if (!partQuestions) return;
                const questionIndex = partQuestions.findIndex(
                    (question) => question.order === action.payload.order
                );
                const question = partQuestions[questionIndex];
                if (!question) return;

                state.testParts[partIndex].questions![questionIndex] = {
                    ...question,
                    ...action.payload,
                };
            } else {
                const questionIndex = state.testQuestions.findIndex(
                    (question) => question.order === action.payload.order
                );
                const question = state.testQuestions[questionIndex];
                if (!question) return;

                state.testQuestions[questionIndex] = {
                    ...question,
                    ...action.payload,
                };
            }
        },
        initializeTestAnswers(state) {
            if (state.numParts > 1) {
                state.testParts.map((part) => {
                    const questions = initializeAnswers(part.questions!);
                    return {
                        ...part,
                        questions,
                    };
                });
            } else {
                state.testQuestions = initializeAnswers(state.testQuestions);
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
                    state.isValidTestInfo = validateTestInfo({
                        title: state.testTitle,
                        datetime: state.testDatetime,
                        duration: state.testDuration,
                        max_score: state.maxScore,
                        num_parts: state.numParts,
                        num_questions: state.numQuestions,
                    });
                    break;
                }
                case CREATE_TEST_STEPS.TEST_PARTS: {
                    state.isValidParts = validateParts(
                        state.testParts || [],
                        state.numParts,
                        state.numQuestions,
                        state.maxScore
                    );
                    break;
                }
                case CREATE_TEST_STEPS.TEST_QUESTIONS: {
                    state.isValidQuestions = validateQuestions(
                        state.testParts || [],
                        state.testQuestions || [],
                        state.numQuestions,
                        state.maxScore
                    );
                    break;
                }
                case CREATE_TEST_STEPS.TEST_ANSWERS: {
                    state.isValidAnswers = validateAnswers();
                    break;
                }
                case CREATE_TEST_STEPS.TEST_TAKERS: {
                    state.isValidShareOption = validateShareOption(
                        state.shareOption,
                        state.selectedTestTakers.length,
                        state.passcode
                    );
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
        handleReorderQuestion(
            state,
            action: PayloadAction<{
                startOrder: number;
                endOrder: number;
                partFromId?: string;
                partToId?: string;
            }>
        ) {
            const { startOrder, endOrder, partFromId, partToId } =
                action.payload;

            let startIndex, endIndex;

            if (partFromId && partToId) {
                const partFrom = state.testParts.find(
                    (part) => part.id === partFromId
                );
                const partTo = state.testParts.find(
                    (part) => part.id === partToId
                );

                if (!partFrom || !partTo) return;
                startIndex = partFrom.questions?.findIndex(
                    (question) => question.order === startOrder
                );
                endIndex = partTo.questions?.findIndex(
                    (question) => question.order === endOrder
                );

                if (startIndex === undefined || endIndex === undefined) return;

                console.log("hello");
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
                    questionToAdd.order = endOrder;

                    const moveDirection =
                        partFromIndex < partToIndex ? "down" : "up";

                    state.testParts[partToIndex].questions = addQuestion(
                        partToQuestions,
                        questionToAdd,
                        endIndex,
                        moveDirection,
                        state.questionNumberingMethod
                    );

                    state.testParts[partFromIndex].questions = removeQuestion(
                        partFromQuestions,
                        startIndex,
                        moveDirection,
                        state.questionNumberingMethod
                    );

                    if (partFromIndex < partToIndex) {
                        for (let i = partFromIndex + 1; i < partToIndex; i++) {
                            changeIntermediateQuestionsOrder(
                                state.testParts[i].questions!,
                                "increase"
                            );
                        }
                    } else {
                        for (let i = partFromIndex - 1; i > partToIndex; i--) {
                            changeIntermediateQuestionsOrder(
                                state.testParts[i].questions!,
                                "decrease"
                            );
                        }
                    }

                    state.testParts[partFromIndex].num_questions -= 1;
                    state.testParts[partToIndex].num_questions += 1;
                }
            } else {
                startIndex = state.testQuestions?.findIndex(
                    (question) => question.order === startOrder
                );
                endIndex = state.testQuestions?.findIndex(
                    (question) => question.order === endOrder
                );

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
            if (action.payload.test.question_numbering_method) {
                state.questionNumberingMethod =
                    action.payload.test.question_numbering_method;
            }

            state.testParts = action.payload?.parts;
            if (state.testParts && state.testParts.length > 0) {
                state.testParts = initializeParts(
                    state.testParts,
                    state.numParts,
                    state.testId
                );
            }

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

            if (
                action.payload.questions &&
                action.payload.questions.length > 0
            ) {
                state.testQuestions = action.payload.questions;
                state.testQuestions = initializeQuestions(
                    state.testQuestions,
                    state.numQuestions,
                    state.testId
                );
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
        navigateStep(state, action: PayloadAction<CREATE_TEST_STEPS>) {
            const currentStep = state.steps?.find(
                (step) => step.value === state.currentStep
            );
            const targetStep = state.steps?.find(
                (step) => step.value === action.payload
            );
            if (!targetStep || !currentStep) return;

            if (currentStep.index > targetStep.index) {
                state.currentStep = targetStep.value;
                return;
            }

            let currentStepIndex = currentStep.index;
            stepLoop: for (
                let i = currentStep.index - 1;
                i < targetStep.index;
                i++
            ) {
                currentStepIndex = i;
                switch (state.steps[i].value) {
                    case CREATE_TEST_STEPS.TEST_INFORMATION:
                        if (
                            validateTestInfo({
                                title: state.testTitle,
                                datetime: state.testDatetime,
                                duration: state.testDuration,
                                max_score: state.maxScore,
                                num_parts: state.numParts,
                                num_questions: state.numQuestions,
                            })
                        ) {
                            state.isValidTestInfo = true;
                            continue;
                        }
                        break stepLoop;
                    case CREATE_TEST_STEPS.TEST_PARTS: {
                        if (
                            validateParts(
                                state.testParts || [],
                                state.numParts,
                                state.numQuestions,
                                state.maxScore
                            )
                        ) {
                            state.isValidParts = true;
                            continue;
                        }
                        break stepLoop;
                    }
                    case CREATE_TEST_STEPS.TEST_QUESTIONS: {
                        if (
                            validateQuestions(
                                state.testParts,
                                state.testQuestions,
                                state.numQuestions,
                                state.maxScore
                            )
                        ) {
                            state.isValidQuestions = true;
                            continue;
                        }
                        break stepLoop;
                    }
                    case CREATE_TEST_STEPS.TEST_ANSWERS: {
                        if (validateAnswers()) {
                            state.isValidAnswers = true;
                            continue;
                        }
                        break stepLoop;
                    }
                    case CREATE_TEST_STEPS.TEST_TAKERS: {
                        if (
                            validateShareOption(
                                state.shareOption,
                                state.selectedTestTakers.length,
                                state.passcode
                            )
                        ) {
                            state.isValidShareOption = true;
                            continue;
                        }
                        break stepLoop;
                    }
                    default:
                        break;
                }
            }
            state.currentStep = state.steps[currentStepIndex].value;
        },
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
        setOpenAllParts(state, action: PayloadAction<boolean>) {
            state.openAllParts = action.payload;
        },
    },
});

export const createTestReducer = createTestSlice.reducer;
export const createTestActions = createTestSlice.actions;
