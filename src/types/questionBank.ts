import { QUESTION_LEVEL, QUESTION_TYPE } from "../config/constants/tests";
import { QuestionBodyContentItf, QuestionContentItf } from "./types";

export interface QuestionBankBodyItf {
    name: string;
    description: string;
    tags: string[];
    is_bookmarked: boolean;
}

export interface QuestionBankBodyTempItf {
    name: string;
    description: string;
    is_bookmarked: boolean;
    tags: { name: string }[];
}

export interface QuestionBankItf extends QuestionBankBodyItf {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    questions: string[];
    questions_detail: QuestionInBankItf<QuestionBodyContentItf>[];
}

export interface QuestionInBankItf<T extends QuestionContentItf> {
    id?: string;
    score?: number;
    level?: QUESTION_LEVEL;
    type: QUESTION_TYPE;
    content?: T;
    is_saved?: boolean;
    is_content_provided?: boolean;
    partial_scoring?: boolean;
    imported_from?: string;
}
