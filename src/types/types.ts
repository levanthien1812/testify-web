import {
    PASSCODE_VALID_UNIT,
    QUESTION_LEVEL,
    ROLES,
    SHARE_OPTIONS,
    TEST_LEVEL,
    TEST_STATUS,
} from "../config/constants/tests";
import { QUESTION_TYPE } from "../config/constants/tests";
import { TestOptions } from "./tests";

export interface userItf {
    username?: string;
    name: string;
    email: string;
    role: ROLES;
    maker_id?: string;
    id: string;
    photo?: string;
    blocked_users?: string[];
    blocked_by?: string[];
    birthday?: Date;
    gender?: string;
    phone_number?: string;
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
    level: TEST_LEVEL;
    share_option?: SHARE_OPTIONS;
    passcode?: string;
    options: TestOptions;
}
export interface TestItf extends TestBodyItf {
    id: string;
    parts: TestPartItf[];
    maker_id: string;
    taker_ids: TakerItf[];
    joined_taker_ids: string[];
    are_answers_provided: boolean;
    includes_manually_scored_questions?: boolean;
    questions?: QuestionItf<QuestionContentItf>[];
    submissions_count?: number;
    status: TEST_STATUS;
}

export interface PartBodyItf {
    name: string;
    score: number;
    description: string;
    num_questions: number;
    order: number;
}

export interface TestPartItf extends PartBodyItf {
    id?: string;
    test_id?: string;
    questions?: QuestionItf<QuestionContentItf>[];
    is_saved?: boolean;
    // error?: Omit<PartBodyItf, "order">;
}

export interface MultipleChoiceQuestionBodyItf {
    text: string;
    allow_multiple: boolean;
    options: {
        text: string;
    }[];
}

export interface MultipleChoiceQuestionItf
    extends MultipleChoiceQuestionBodyItf,
        BaseQuestionContentItf<MultipleChoiceAnswerItf> {
    id?: string;
    options: {
        text: string;
        id?: string;
    }[];
}

export interface FillGapsQuestionBodyItf {
    text: string;
    num_gaps: number;
}

export interface FillGapsQuestionItf
    extends FillGapsQuestionBodyItf,
        BaseQuestionContentItf<FillGapsAnswerItf> {
    id?: string;
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

export interface MatchingQuestionItf
    extends MatchingQuestionBodyItf,
        BaseQuestionContentItf<MatchingAnswerItf> {
    id?: string;
    left_items: {
        id?: string;
        text: string;
    }[];
    right_items: {
        id?: string;
        text: string;
    }[];
}

export interface ResponseQuestionBodyItf {
    text: string;
    min_length?: number;
    max_length?: number;
}

export interface ResponseQuestionItf
    extends ResponseQuestionBodyItf,
        BaseQuestionContentItf<ResponseAnswerItf> {
    id?: string;
}

export interface TrueFalseQuestionBodyItf {
    text: string;
}

export interface TrueFalseQuestionItf
    extends TrueFalseQuestionBodyItf,
        BaseQuestionContentItf<TrueFalseAnswerItf> {
    id?: string;
}

export interface BaseQuestionContentItf<T extends AnswerBodyContentItf> {
    answer?: T;
}

export type QuestionContentItf =
    | MultipleChoiceQuestionItf
    | FillGapsQuestionItf
    | MatchingQuestionItf
    | ResponseQuestionItf
    | TrueFalseQuestionItf;

export interface QuestionItf<T extends QuestionContentItf> {
    id?: string;
    order: number;
    test_id: string;
    score: number;
    level: QUESTION_LEVEL;
    type: QUESTION_TYPE;
    part_id?: string;
    content?: T;
    is_saved?: boolean;
    is_content_provided?: boolean;
}

export type QuestionBodyContentItf =
    | MultipleChoiceQuestionBodyItf
    | FillGapsQuestionBodyItf
    | MatchingQuestionBodyItf
    | ResponseQuestionBodyItf;

export interface QuestionBodyItf<T extends QuestionBodyContentItf> {
    score?: number;
    level?: QUESTION_LEVEL;
    type: QUESTION_TYPE;
    order?: number;
    part_id?: string;
    content: T;
}

export interface BaseAnswerItf {
    is_saved?: boolean;
    explaination?: string;
}

export type AnswerBodyContentItf =
    | MultipleChoiceAnswerItf
    | FillGapsAnswerItf
    | MatchingAnswerItf
    | ResponseAnswerItf
    | TrueFalseAnswerItf;

export interface MultipleChoiceAnswerItf extends BaseAnswerItf {
    options: string[];
}
export interface FillGapsAnswerItf extends BaseAnswerItf {
    gaps: string[];
}
export interface MatchingAnswerItf extends BaseAnswerItf {
    matchings: {
        left: string;
        right: string;
    }[];
}
export interface ResponseAnswerItf extends BaseAnswerItf {
    response: string;
}

export interface TrueFalseAnswerItf extends BaseAnswerItf {
    is_true: boolean;
}

export interface PasscodeItf {
    id?: string;
    code: string;
    valid_till?: string;
    valid_in?: number;
    valid_unit?: PASSCODE_VALID_UNIT;
    method: string;
    format?: string;
    test_id?: string;
}

export type GeneratePasscodeBodyItf = Pick<PasscodeItf, "format">;

export type UserAnswerItf<T extends AnswerBodyContentItf> = {
    id?: string;
    question_id: string;
    date?: Date;
    content?: T;
    score?: number;
    is_correct?: boolean;
};

export interface TakerBodyItf {
    name: string;
    email: string;
    gender?: string;
    birthday?: Date;
    phone_number?: string;
    photo?: FileList | string;
}

export interface TakerItf extends TakerBodyItf {
    id?: string;
    maker_ids?: string[];
}

export interface SubmissionItf {
    id: string;
    taker_id: string | userItf;
    test_id: string;
    score?: number;
    correct_answers?: number;
    wrong_answers?: number;
    remark?: string;
    start_time: Date;
    submit_time: Date;
    is_evaluated: boolean;
    answers?: UserAnswerItf<AnswerBodyContentItf>[];
}

export type FilterState = {
    page: number;
    limit: number;
    search?: string;
    sort?: string;
    order?: string;
    date_from?: Date;
    date_to?: Date;
    status?: TEST_STATUS;
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

export interface BreadcrumbHandle {
    crumb: string | ((data: any) => React.ReactNode); // Can be a string or a function
}
