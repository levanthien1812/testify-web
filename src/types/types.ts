import { questionTypes, roles, testLevels } from "../config/config";

export interface userItf {
    username?: string;
    name: string;
    email: string;
    role: (typeof roles)[keyof typeof roles];
    maker_id?: string;
    id: string;
}

export interface authInitialStateItf {
    user: userItf | null;
    isAuthened: boolean;
}

export interface RegisterErrorItf {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    password_confirm?: string;
}

export interface RegisterBodyItf {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginBodyItf {
    email: string;
    password: string;
}
export interface LoginGoogleBodyItf {
    email: string;
    name?: string;
}

export interface LoginErrorItf {
    email?: string;
    password?: string;
}

export interface TestFormDataItf {
    title: string;
    datetime: Date;
    description: string;
    duration: number;
    max_score: number;
    num_questions: number;
    num_parts: number;
    level: (typeof testLevels)[keyof typeof testLevels];
    code: string;
}

export interface PartFormDataItf {
    name: string;
    score: number;
    description: string;
    num_questions: number;
    order: number;
}

export interface TestPartItf extends PartFormDataItf {
    _id: string;
    test_id: string;
    questions?: QuestionItf[];
}

export interface MultipleChoiceQuestionFormDataItf {
    text: string;
    allow_multiple: boolean;
    options: {
        text: string;
    }[];
}

export interface MultipleChoiceQuestionItf
    extends MultipleChoiceQuestionFormDataItf {
    _id: string;
    options: {
        text: string;
        _id: string;
    }[];
    answer?: string[];
    explaination?: string;
}

export interface FillGapsQuestionFormDataItf {
    text: string;
    num_gaps: number;
}

export interface FillGapsQuestionItf extends FillGapsQuestionFormDataItf {
    _id: string;
    answer?: string[];
    explaination?: string;
}

export interface MatchingQuestionFormDataItf {
    text: string;
    left_items: {
        text: string;
    }[];
    right_items: {
        text: string;
    }[];
}

export interface MatchingQuestionItf extends MatchingQuestionFormDataItf {
    _id: string;
    left_items: {
        _id: string;
        text: string;
    }[];
    right_items: {
        _id: string;
        text: string;
    }[];
    answer?: {
        left: string;
        right: string;
    }[];
    explaination?: string;
}

export interface QuestionItf {
    _id: string;
    id: string;
    order: number;
    test_id: string;
    score: number;
    part_number: number;
    level: (typeof testLevels)[keyof typeof testLevels];
    type: (typeof questionTypes)[keyof typeof questionTypes];
    part_id?: string;
    content:
        | MultipleChoiceQuestionItf
        | FillGapsQuestionItf
        | MatchingQuestionItf;
}

export interface QuestionFormDataItf {
    score: number;
    level: (typeof testLevels)[keyof typeof testLevels];
    type: (typeof questionTypes)[keyof typeof questionTypes];
    order: number;
    part_id?: string;
    content:
        | MultipleChoiceQuestionFormDataItf
        | FillGapsQuestionFormDataItf
        | MatchingQuestionFormDataItf
        | null;
}

export interface TestItf extends TestFormDataItf {
    _id: string;
    parts: TestPartItf[];
    maker_id: string;
    taker_ids: string[] | userItf[];
    is_finished: false;
    questions?: QuestionItf[];
}

export interface MultipleChoicesAnswerFormDataInf {
    answer: string[];
}

export interface FillGapsAnswerFormDataInf {
    answer: string[];
}

export interface MatchingAnswerFormDataInf {
    answer: { left: string; right: string }[];
}

export type AnswerFormData =
    | MultipleChoicesAnswerFormDataInf
    | FillGapsAnswerFormDataInf
    | MatchingAnswerFormDataInf;

export interface TakerFormDataItf {
    name: string;
    email: string;
}

export interface TakerItf extends TakerFormDataItf {
    _id: string;
    maker_id: string;
}
