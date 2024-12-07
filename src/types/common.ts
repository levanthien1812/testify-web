type ButtonTypes = "submit" | "reset" | "button";

type ButtonProps = {
    type?: ButtonTypes;
    disabled?: boolean;
    isLoading?: boolean;
    included: boolean;
    text: string;
    extraClass?: string;
    loadingText?: string | null;
    disabledText?: string;
    onClick?: () => void;
};

export type { ButtonTypes, ButtonProps };
