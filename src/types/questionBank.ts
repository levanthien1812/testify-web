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
}
