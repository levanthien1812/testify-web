import { TEST_LEVEL } from "../config/constants/tests";
import { SHARE_OPTIONS } from "../config/constants/tests";
import { QUESTION_NUMBERING_METHOD } from "../config/constants/tests";
import { TestPartItf } from "./types";
import { CreateTestStep, TestOptions } from "./tests";

export interface TestTemplateBodyItf {
    name: string;
    datetime: string;
    description: string;
    duration: number;
    max_score: number;
    num_questions: number;
    num_parts: number;
    level: TEST_LEVEL;
    share_option?: SHARE_OPTIONS;
    options: TestOptions;
    question_numbering_method?: QUESTION_NUMBERING_METHOD;
    parts?: TestPartItf[];
}

export interface TestTemplateItf extends TestTemplateBodyItf {
    id: string;
    maker_id: string;
}

export interface CreateTestTemplateContext {
    currentStep: string; // TEMPLATE_INFORMATION or TEMPLATE_PARTS
    steps: CreateTestStep[];
    enablePrevStep: boolean;
    enableNextStep: boolean;
    templateId: string;
    templateName: string;
    testDescription: string;
    testDuration: number;
    maxScore: number;
    numQuestions: number;
    numParts: number;
    level: TEST_LEVEL;
    testParts: TestPartItf[];
    options: any;
    isValidTemplateInfo: boolean;
    isValidCurrentPart: boolean;
    isValidParts: boolean;
}
