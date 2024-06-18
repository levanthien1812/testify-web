import {
    publicAnswersOptions,
    questionTypes,
    roles,
    testLevels,
    testStatus,
} from "../config/config";

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
    close_time?: Date;
    share_option?: "restricted" | "anyone";
    public_answers_option: (typeof publicAnswersOptions)[keyof typeof publicAnswersOptions];
    public_answers_date?: Date;
}
export interface TestItf extends TestFormDataItf {
    _id: string;
    parts: TestPartItf[];
    maker_id: string;
    taker_ids: string[] | userItf[];
    is_finished: false;
    questions?: QuestionItf[];
    status: (typeof testStatus)[keyof typeof testStatus];
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
    answer?: AnswerItf;
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

export type AnswerItf = {
    _id: string;
    date: Date;
    content: MultipleChoicesAnswerItf | FillGapsAnswerItf | MatchingAnswerItf;
    score?: number;
};

export interface MultipleChoicesAnswerFormDataItf {
    answer: string[];
}

export interface MultipleChoicesAnswerItf
    extends MultipleChoicesAnswerFormDataItf {
    _id: string;
    answer_id?: string;
}

export interface FillGapsAnswerFormDataItf {
    answer: string[];
}

export interface FillGapsAnswerItf extends FillGapsAnswerFormDataItf {
    _id: string;
    answer_id?: string;
}

export interface MatchingAnswerFormDataItf {
    answer: { left: string; right: string }[];
}

export interface MatchingAnswerItf extends MatchingAnswerFormDataItf {
    _id: string;
    answer_id?: string;
}

export type AnswerFormData =
    | MultipleChoicesAnswerFormDataItf
    | FillGapsAnswerFormDataItf
    | MatchingAnswerFormDataItf;

export interface TakerFormDataItf {
    name: string;
    email: string;
}

export interface TakerItf extends TakerFormDataItf {
    _id: string;
    maker_id: string;
}

export interface UserMultipleChoicesAnswerFormDataItf {
    question_id: string;
    answer: string[];
}

export interface UserFillGapsAnswerFormDataItf {
    question_id: string;
    answer: string[];
}

export interface UserMatchingAnswerFormDataItf {
    question_id: string;
    answer: { left: string; right: string }[];
}

export type UserAnswer =
    | UserMultipleChoicesAnswerFormDataItf
    | UserFillGapsAnswerFormDataItf
    | UserMatchingAnswerFormDataItf;

export interface SubmissionItf {
    _id: string;
    taker_id: string | Omit<userItf, "role">;
    test_id: string;
    score?: number;
    correct_answers?: number;
    wrong_answers?: number;
    remark?: string;
    start_time: Date;
    submit_time: Date;
}
