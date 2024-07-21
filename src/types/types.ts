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
    photo?: string;
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

export interface TestBodyItf {
    title: string;
    datetime: string;
    description: string;
    duration: number;
    max_score: number;
    num_questions: number;
    num_parts: number;
    level: (typeof testLevels)[keyof typeof testLevels];
    code: string;
    enable_close_time: boolean;
    close_time: string;
    share_option?: "restricted" | "anyone";
    public_answers_option: (typeof publicAnswersOptions)[keyof typeof publicAnswersOptions];
    public_answers_date: string;
}
export interface TestItf extends TestBodyItf {
    _id: string;
    parts: TestPartItf[];
    maker_id: string;
    taker_ids: string[] | userItf[];
    are_answers_provided: boolean;
    questions?: QuestionItf[];
    submissions_count?: number;
    status: (typeof testStatus)[keyof typeof testStatus];
}

export interface PartBodyItf {
    name: string;
    score: number;
    description: string;
    num_questions: number;
    order: number;
}

export interface TestPartItf extends PartBodyItf {
    _id: string;
    test_id: string;
    questions?: QuestionItf[];
}

export interface MultipleChoiceQuestionBodyItf {
    text: string;
    allow_multiple: boolean;
    options: {
        text: string;
    }[];
    images?: FileList | string[] | null;
}

export interface MultipleChoiceQuestionItf
    extends MultipleChoiceQuestionBodyItf {
    _id: string;
    options: {
        text: string;
        _id: string;
    }[];
    answer?: string[];
    explaination?: string;
    images?: string[];
}

export interface FillGapsQuestionBodyItf {
    text: string;
    num_gaps: number;
}

export interface FillGapsQuestionItf extends FillGapsQuestionBodyItf {
    _id: string;
    answer?: string[];
    explaination?: string;
}

export interface MatchingQuestionBodyItf {
    text: string;
    left_items: {
        text: string;
    }[];
    right_items: {
        text: string;
    }[];
}

export interface MatchingQuestionItf extends MatchingQuestionBodyItf {
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

export interface ResponseQuestionBodyItf {
    text: string;
    min_length?: number;
    max_length?: number;
    images?: string[];
}

export interface ResponseQuestionItf extends ResponseQuestionBodyItf {
    _id: string;
    answer?: string;
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
    answer?: AnswerItf; // user_answer
    content:
        | MultipleChoiceQuestionItf
        | FillGapsQuestionItf
        | MatchingQuestionItf
        | ResponseQuestionItf;
}

export type QuestionBodyContentItf =
    | MultipleChoiceQuestionBodyItf
    | FillGapsQuestionBodyItf
    | MatchingQuestionBodyItf
    | ResponseQuestionBodyItf
    | null;

export interface QuestionBodyItf<T extends QuestionBodyContentItf> {
    score: number;
    level: (typeof testLevels)[keyof typeof testLevels];
    type: (typeof questionTypes)[keyof typeof questionTypes];
    order: number;
    part_id?: string;
    content: T;
}

export type AnswerItf = {
    _id: string;
    date: Date;
    content:
        | MultipleChoicesAnswerItf
        | FillGapsAnswerItf
        | MatchingAnswerItf
        | ResponseAnswerItf;
    score?: number;
};

export interface MultipleChoicesAnswerBodyItf {
    answer: string[];
}

export interface MultipleChoicesAnswerItf extends MultipleChoicesAnswerBodyItf {
    _id: string;
    answer_id?: string;
}

export interface FillGapsAnswerBodyItf {
    answer: string[];
}

export interface FillGapsAnswerItf extends FillGapsAnswerBodyItf {
    _id: string;
    answer_id?: string;
}

export interface MatchingAnswerBodyItf {
    answer: { left: string; right: string }[];
}

export interface MatchingAnswerItf extends MatchingAnswerBodyItf {
    _id: string;
    answer_id?: string;
}

export interface ResponseAnswerBodyItf {
    answer: string;
}

export interface ResponseAnswerItf extends ResponseAnswerBodyItf {
    _id: string;
    answer_id?: string;
}

export type AnswerBody =
    | MultipleChoicesAnswerBodyItf
    | FillGapsAnswerBodyItf
    | MatchingAnswerBodyItf
    | ResponseAnswerBodyItf;

export interface TakerBodyItf {
    name: string;
    email: string;
}

export interface TakerItf extends TakerBodyItf {
    id: string;
    maker_ids: string[];
}

export interface UserMultipleChoicesAnswerBodyItf {
    question_id: string;
    answer: string[];
}

export interface UserFillGapsAnswerBodyItf {
    question_id: string;
    answer: string[];
}

export interface UserMatchingAnswerBodyItf {
    question_id: string;
    answer: { left: string; right: string }[];
}

export interface UserResponseAnswerBodyItf {
    question_id: string;
    answer: string;
}

export type UserAnswer =
    | UserMultipleChoicesAnswerBodyItf
    | UserFillGapsAnswerBodyItf
    | UserMatchingAnswerBodyItf
    | UserResponseAnswerBodyItf;

export interface SubmissionItf {
    _id: string;
    taker_id: string | userItf;
    test_id: string;
    score?: number;
    correct_answers?: number;
    wrong_answers?: number;
    remark?: string;
    start_time: Date;
    submit_time: Date;
}

export type FilterState = {
    page: number;
    limit: number;
    search?: string;
    sort?: string;
    order?: string;
    date_from?: Date;
    date_to?: Date;
    status?: (typeof testStatus)[keyof typeof testStatus];
};

export type TestRequestFilter = Pick<
    FilterState,
    "search" | "sort" | "date_from" | "date_to" | "status"
>;

export type TakerStatistics = {
    taker: userItf;
    average_score: number;
    total_tests_assigned: number;
    total_submissions: number;
};

export interface ChatBodyItf {
    members: string[];
}

export interface ChatItf {
    _id: string;
    members: {
        member: userItf;
        nick_name: string | null;
    }[];
    is_group_chat: boolean;
    group_admin: string | userItf | null;
    chat_name: string | null;
    appearances: {
        background_color: string;
        messages_color: string;
    };
    created_at: Date;
    updated_at: Date;
}

export interface MessageBody {
    chat_id: string;
    text: string;
}

export interface MessageItf {
    _id: string;
    text: string;
    sender_id: string;
    chat_id: string;
    created_at: Date;
    updated_at: Date;
}
