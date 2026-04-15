import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    INITIAL_CREATE_TEST_TEMPLATE_CONTEXT,
    INITIAL_OPTIONS,
} from "../config/constants/initialValues";
import { TEST_LEVEL } from "../config/constants/tests";
import { TestPartItf } from "../types/types";
import { sortByOrderFn } from "../utils/test";
import { initializeTemplateParts as initializePartsHelper } from "./actionFns/createTestTemplate";
import { TestTemplateItf } from "../types/testTemplate";
import { CREATE_TEST_TEMPLATE_STEPS } from "../config/constants/testTemplate";

const createTestTemplateSlice = createSlice({
    initialState: INITIAL_CREATE_TEST_TEMPLATE_CONTEXT,
    name: "createTestTemplate",
    reducers: {
        saveTemplateInfo(state, action) {
            console.log(action.payload);
            if (action.payload?.name) state.templateName = action.payload.name;
            if (action.payload?.description)
                state.testDescription = action.payload.description;
            if (action.payload?.duration)
                state.testDuration = parseInt(action.payload.duration);
            if (action.payload?.max_score)
                state.maxScore = parseFloat(action.payload.max_score);
            if (action.payload?.num_parts)
                state.numParts = action.payload.num_parts;
            if (action.payload?.level) state.level = action.payload.level;

            if (action.payload?.options)
                state.options = JSON.parse(
                    JSON.stringify(action.payload.options),
                );
            if (action.payload.templateId)
                state.templateId = action.payload.templateId;
        },
        initializeTemplateParts(state) {
            state.testParts = initializePartsHelper(
                state.testParts,
                state.numParts,
                state.templateId!,
            );
        },
        saveTemplateParts(state, action: PayloadAction<Partial<TestPartItf>>) {
            if (!action.payload.order) return;
            const partIndex = state.testParts.findIndex(
                (part) => part.order === action.payload.order,
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
            action: PayloadAction<{ partId: string; direction: "up" | "down" }>,
        ) {
            let updatedParts = [...state.testParts];
            const partToMoveIndex = state.testParts.findIndex(
                (part) => part.id === action.payload.partId,
            );
            if (partToMoveIndex === -1) return;

            if (action.payload.direction === "up") {
                const partAboveIndex = state.testParts.findIndex(
                    (part) =>
                        part.order === updatedParts[partToMoveIndex].order - 1,
                );
                if (partAboveIndex === -1) return;
                updatedParts[partToMoveIndex].order =
                    updatedParts[partAboveIndex].order;
                updatedParts[partAboveIndex].order =
                    updatedParts[partToMoveIndex].order + 1;
            } else {
                const partBelowIndex = state.testParts.findIndex(
                    (part) =>
                        part.order === updatedParts[partToMoveIndex].order + 1,
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
        setTemplateFromAPI(
            state,
            action: PayloadAction<{
                template: TestTemplateItf;
                parts: TestPartItf[];
            }>,
        ) {
            state.templateName = action.payload.template.name;
            state.testDescription = action.payload.template.description;
            state.testDuration = action.payload.template.duration;
            state.maxScore = action.payload.template.max_score;
            state.numParts = action.payload.template.num_parts;
            state.level = action.payload.template.level;
            state.templateId = action.payload.template.id;

            state.testParts = action.payload?.parts;
            if (state.testParts && state.testParts.length > 0) {
                state.testParts = initializePartsHelper(
                    state.testParts,
                    state.numParts,
                    state.templateId,
                );
            }

            state.options = {
                ...INITIAL_OPTIONS,
                ...action.payload.template.options,
            };
        },
        validateCurrentPart(
            state,
            action: PayloadAction<{ partIndex: number }>,
        ) {
            const currentPart = state.testParts[action.payload.partIndex];
            if (
                currentPart?.name?.length === 0 ||
                (currentPart?.num_questions && currentPart.num_questions <= 0)
            ) {
                state.isValidCurrentPart = false;
            } else {
                state.isValidCurrentPart = true;
            }
        },
        validate(state) {
            // Validate template info
            if (
                state.templateName?.length === 0 ||
                state.testDuration <= 0 ||
                state.maxScore <= 0
            ) {
                state.isValidTemplateInfo = false;
            } else {
                state.isValidTemplateInfo = true;
            }
        },
        moveNextStep(state) {
            const currentStep = state.steps?.find(
                (step) => step.value === state.currentStep,
            );
            if (!currentStep) return;
            if (currentStep?.index === state.steps?.length) {
                state.enableNextStep = false;
                return;
            }
            const next_step = state.steps?.find(
                (step) => step.index === currentStep?.index + 1,
            );
            state.currentStep = next_step ? next_step.value : "";
            state.enablePrevStep = true;
        },
        movePrevStep(state) {
            const currentStep = state.steps?.find(
                (step) => step.value === state.currentStep,
            );
            if (!currentStep) return;
            if (currentStep?.index === 1) {
                state.enablePrevStep = false;
                return;
            }
            const prev_step = state.steps?.find(
                (step) => step.index === currentStep?.index - 1,
            );
            state.currentStep = prev_step ? prev_step.value : "";
            state.enableNextStep = true;
        },
        navigateStep(state, action: PayloadAction<CREATE_TEST_TEMPLATE_STEPS>) {
            const currentStep = state.steps?.find(
                (step) => step.value === state.currentStep,
            );
            const targetStep = state.steps?.find(
                (step) => step.value === action.payload,
            );
            if (!targetStep || !currentStep) return;

            if (currentStep.index > targetStep.index) {
                state.currentStep = targetStep.value;
                state.enablePrevStep = targetStep.index > 1;
                state.enableNextStep = targetStep.index < state.steps.length;
                return;
            }

            // Can only move forward if current step is valid
            if (currentStep.index === 1) {
                if (state.isValidTemplateInfo) {
                    state.currentStep = targetStep.value;
                    state.enablePrevStep = targetStep.index > 1;
                    state.enableNextStep =
                        targetStep.index < state.steps.length;
                }
            }
        },
        reset(state) {
            return INITIAL_CREATE_TEST_TEMPLATE_CONTEXT;
        },
    },
});

export const createTestTemplateReducer = createTestTemplateSlice.reducer;
export const createTestTemplateActions = createTestTemplateSlice.actions;
