import React from "react";
import BarLoader from "react-spinners/BarLoader";
import Button from "../elements/Button";

type LoadingProps = {
    isLoading: boolean;
    loadingText?: {
        text: string;
        extraClass?: string;
    };
    description?: {
        text: string;
        extraClass?: string;
    };
    extraClass?: string;
    actionButton?: {
        text: string;
        onClick: () => void;
        extraClass?: string;
    };
};

const Loading = ({
    isLoading,
    loadingText,
    description,
    extraClass,
    actionButton,
}: LoadingProps) => {
    if (isLoading) {
        return (
            <div
                className={`flex flex-col items-center justify-center space-y-2 py-8 ${extraClass}`}
            >
                <BarLoader
                    loading={true}
                    color="#f97316"
                    width={200}
                    height={5}
                    speedMultiplier={1}
                />
                {loadingText && (
                    <p className={`text-md ${loadingText?.extraClass}`}>
                        {loadingText.text}
                    </p>
                )}
                {description && (
                    <p className={`text-sm ${description?.extraClass}`}>
                        {description.text}
                    </p>
                )}
                {actionButton && (
                    <Button
                        onClick={actionButton.onClick}
                        className={`${actionButton.extraClass}`}
                    >
                        {actionButton.text}
                    </Button>
                )}
            </div>
        );
    } else {
        return <div></div>;
    }
};

export default Loading;
