import { roles, testLevels } from "../config/config";

export interface userItf {
    username: string;
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

export interface LoginErrorItf {
    email?: string;
    password?: string;
}

export interface TestFormDataItf {
    title: "";
    datetime: Date;
    description: string;
    duration: number;
    max_score: number;
    num_questions: number;
    level: (typeof testLevels)[keyof typeof testLevels];
    code: string;
}
