export enum USER_GENDER {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
}

export enum TAKER_FIELDS {
    NAME = "name",
    EMAIL = "user.email",
    GENDER = "user.gender",
    BIRTHDAY = "user.birthday",
    PHONE_NUMBER = "user.phone_number",
    GROUP = "group_id",
}

export const GENDER_OPTIONS = [
    { value: "", label: "Select gender" },
    { value: USER_GENDER.MALE, label: "Male" },
    { value: USER_GENDER.FEMALE, label: "Female" },
];
