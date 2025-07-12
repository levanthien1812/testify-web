import MoonLoader from "react-spinners/MoonLoader";

type LoadingProps = {
    isLoading: boolean;
    loadingText?: {
        text: string;
        extraClass?: string;
    };
    extraClass?: string;
};

const InlineLoading = ({
    isLoading,
    loadingText,
    extraClass,
}: LoadingProps) => {
    if (isLoading) {
        return (
            <div className={`flex items-center space-x-2 ${extraClass}`}>
                <MoonLoader
                    loading={true}
                    color="#f97316"
                    size={15}
                    speedMultiplier={1}
                />
                {loadingText && (
                    <p className={`text-md ${loadingText?.extraClass}`}>
                        {loadingText.text}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default InlineLoading;
