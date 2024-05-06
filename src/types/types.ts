import { roles } from "../config/config"

export interface userItf {
    username: string,
    name: string,
    email: string,
    role: typeof roles[keyof typeof roles],
    maker_id?: string,
    id: string
}

export interface authInitialStateItf {
    user: userItf | null,
    isAuthened: boolean,
}