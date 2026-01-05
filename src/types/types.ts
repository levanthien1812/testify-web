import { password } from "./../validations/custom";
import {
    FILL_GAP_METHOD,
    PASSCODE_VALID_UNIT,
    QUESTION_LEVEL,
    QUESTION_NUMBERING_METHOD,
    RECORD_MODE,
    ROLES,
    SHARE_OPTIONS,
    TEST_LEVEL,
    TEST_STATUS,
} from "../config/constants/tests";
import { QUESTION_TYPE } from "../config/constants/tests";
import { TestOptions } from "./tests";

export interface UserBodyItf {
    name: string;
    email: string;
    gender?: string;
    birthday?: Date;
    phone_number?: string;
    photo?: FileList | string;
    old_password?: string;
    password?: string;
    password_confirm?: string;
}

export interface UserItf extends UserBodyItf {
    role: ROLES;
    id: string;
    photo?: string;
    blocked_users?: string[];
    blocked_by?: string[];
}

export interface authInitialStateItf {
    user: UserItf | null;
    isAuthened: boolean;
}

export interface RegisterErrorItf {
    name?: string;
    email?: string;
    password?: string;
    password_confirm?: string;
}

export interface RegisterBodyItf {
    name: string;
    email: string;
    password: string;
}

export interface VerifyEmailBodyItf {
    email: string;
    code: string;
}

export interface SendVerificationCodeBodyItf {
    email: string;
}

export interface ForgotPasswordBodyItf {
    email: string;
}

export interface ResetPasswordBodyItf {
    email: string;
    token: string;
    password: string;
    password_confirm: string;
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
    passcode_id?: string;
    options: TestOptions;
    question_numbering_method?: QUESTION_NUMBERING_METHOD;
}
export interface TestItf extends TestBodyItf {
    id: string;
    parts: TestPartItf[];
    maker_id: string;
    taker_ids: string[];
    takers: TakerItf[];
    joined_taker_ids: string[];
    are_answers_provided: boolean;
    includes_manually_scored_questions?: boolean;
    questions?: QuestionItf<QuestionContentItf>[];
    submissions_count?: number;
    status: TEST_STATUS;
    passcode?: PasscodeItf;
    notify_assignment?: boolean;
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
    instruction_text?: string;
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
    instruction_text?: string;
    text: string;
    num_gaps: number;
    json_text: string;
    fill_method: FILL_GAP_METHOD;
    given_words?: {
        text: string;
    }[];
}

export interface FillGapsQuestionItf
    extends FillGapsQuestionBodyItf,
        BaseQuestionContentItf<FillGapsAnswerItf> {
    id?: string;
}

export interface MatchingQuestionBodyItf {
    instruction_text?: string;
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
    instruction_text?: string;
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
    instruction_text?: string;
    text: string;
}

export interface TrueFalseQuestionItf
    extends TrueFalseQuestionBodyItf,
        BaseQuestionContentItf<TrueFalseAnswerItf> {
    id?: string;
}

export interface BaseQuestionContentItf<T extends AnswerContentItf> {
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
    level?: QUESTION_LEVEL;
    type: QUESTION_TYPE;
    part_id?: string;
    content?: T;
    is_saved?: boolean;
    is_content_provided?: boolean;
    partial_scoring: boolean;
    imported_from?: string;
}

export type QuestionBodyContentItf =
    | MultipleChoiceQuestionBodyItf
    | FillGapsQuestionBodyItf
    | MatchingQuestionBodyItf
    | ResponseQuestionBodyItf
    | TrueFalseQuestionBodyItf;

export interface QuestionBodyItf<T extends QuestionBodyContentItf> {
    score?: number;
    level?: QUESTION_LEVEL;
    type: QUESTION_TYPE;
    order?: number;
    part_id?: string;
    partial_scoring?: boolean;
    content: T;
}

export interface BaseAnswerItf {
    is_saved?: boolean;
    explaination?: string;
}

export type AnswerContentItf =
    | MultipleChoiceAnswerItf
    | FillGapsAnswerItf
    | MatchingAnswerItf
    | ResponseAnswerItf
    | TrueFalseAnswerItf;

export interface MultipleChoiceAnswerItf extends BaseAnswerItf {
    options: string[];
}
export interface FillGapsAnswerItf extends BaseAnswerItf {
    gaps: {
        id: string;
        text: string;
        is_correct?: boolean;
    }[];
}
export interface MatchingAnswerItf extends BaseAnswerItf {
    matchings: {
        left: string;
        right: string;
        is_correct?: boolean;
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
}

export type GeneratePasscodeBodyItf = Pick<PasscodeItf, "format">;

export interface UserAnswerBodyItf<T extends AnswerContentItf> {
    question_id: string;
    content: T;
}

export interface UserAnswerItf<T extends AnswerContentItf>
    extends UserAnswerBodyItf<T> {
    id?: string;
    date?: Date;
    score?: number;
    is_correct?: boolean;
    skipped?: boolean;
    evaluated?: boolean;
}

export interface TakerBodyItf extends UserBodyItf {
    group_id?: string;
}

export interface TakerItf {
    id: string;
    name: string;
    maker_id: string;
    user_id: string;
    group_id?: string;
    group?: TakerGroupItf;
    user: UserItf;
    onboarded: boolean;
}

export interface MakerItf {
    id: string;
    user_id: string;
    user: UserItf;
}
export interface SubmissionItf {
    id: string;
    taker_id: string;
    taker: TakerItf;
    test_id: string;
    score?: number;
    correct_answers?: number;
    wrong_answers?: number;
    remark?: string;
    start_time: Date;
    submit_time: Date;
    is_evaluated: boolean;
    answers?: UserAnswerItf<AnswerContentItf>[];
    shuffled_questions?: string[];
    recording?: {
        mode: RECORD_MODE;
        video_url?: string;
        screenshot_urls?: string[];
    };
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
    taker: TakerItf;
    average_score: number;
    total_tests_assigned: number;
    total_submissions: number;
};

export interface BreadcrumbHandle {
    crumb: string | ((data: any) => React.ReactNode); // Can be a string or a function
}

export interface TakerGroupBodyItf {
    name: string;
    description?: string;
    takers?: string[];
}

export interface TakerGroupItf extends TakerGroupBodyItf {
    id: string;
    maker_id: string;
}

export type TipTapTextType = "text" | "inputPlaceholder";

export interface TipTapDoc {
    type: "doc";
    content: {
        type: "paragraph";
        content: {
            type: TipTapTextType;
            text: string;
            attrs?: Record<string, any>;
        }[];
    }[];
}

export type GivenAnswersTextFill = Record<
    string,
    { value: string; status?: "normal" | "correct" | "wrong" }
>;

export type TestToImportQuestion = Pick<
    TestItf,
    "id" | "title" | "num_questions" | "questions"
>;

export type AddTakersToGroup = {
    selectedGroup: string | null;
    removeCurrentGroup: boolean;
    takerIds: string[];
};
