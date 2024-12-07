import React from "react";
import BarLoader from "react-spinners/BarLoader";
import Button from "../elements/Button";

type LoadingWrapperProps = {
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
    children: React.ReactNode;
};

const LoadingWrapper = ({
    children,
    isLoading,
    loadingText,
    description,
    extraClass,
    actionButton,
}: LoadingWrapperProps) => {
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
                    <Button onClick={actionButton.onClick}>
                        {actionButton.text}
                    </Button>
                )}
            </div>
        );
    } else {
        return <>{children}</>;
    }
};

export default LoadingWrapper;
