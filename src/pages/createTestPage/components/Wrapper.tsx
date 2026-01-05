import { ReactNode } from "react";
import Button from "../../../components/elements/Button";
import { ButtonProps } from "../../../types/common";
import { useAppSelector } from "../../../hooks/hooks";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";

type ViewData = {
    headerTitle: {
        text: string;
        extraClass?: string;
        description?: {
            text: string;
        };
    };
    bottomButtons: {
        containButton: Partial<ButtonProps>;
        outlinedButton: Partial<ButtonProps>;
        additionalButtons?: Partial<ButtonProps>[];
    };
    canOpenParts?: boolean;
};

const Wrapper = ({
    viewData = {
        headerTitle: {
            text: "",
        },
        bottomButtons: {
            containButton: {
                included: true,
                text: "Next",
                type: "button",
            },
            outlinedButton: {
                included: true,
                text: "Back",
                type: "button",
            },
        },
        canOpenParts: false,
    },
    children,
}: {
    viewData: ViewData;
    children: ReactNode;
}) => {
    const { containButton, outlinedButton, additionalButtons } =
        viewData?.bottomButtons;

    const { openAllParts, testParts } = useAppSelector(
        (state) => state.createTest
    );
    const { setOpenAllParts } = createTestActions;
    const dispatch = useDispatch();

    return (
        <div className="px-2 sm:px-10 md:px-20 py-4 sm:py-8 md:py-12 md:shadow-2xl bg-white">
            <h2 className="text-center text-3xl">
                {viewData?.headerTitle?.text}
            </h2>

            <p className="text-center">
                {viewData?.headerTitle?.description?.text}
            </p>

            {viewData.canOpenParts && testParts.length > 1 && (
                <div className="flex justify-end items-center">
                    <Button
                        outlined
                        onClick={() => dispatch(setOpenAllParts(!openAllParts))}
                        size="sm"
                    >
                        {openAllParts ? "Close all parts" : "Open all parts"}
                    </Button>
                </div>
            )}
            <div className="mt-2 sm:mt-6">{children}</div>

            <div className="flex justify-center md:justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                <>
                    {additionalButtons &&
                        additionalButtons?.map((button) => (
                            <Button
                                size="lg"
                                type="button"
                                disabled={button?.disabled}
                                onClick={button?.onClick}
                            >
                                {!button?.isLoading && !button?.disabled
                                    ? button.text
                                    : button?.loadingText}
                            </Button>
                        ))}
                </>

                {!(outlinedButton?.included === false) && (
                    <Button
                        size="lg"
                        type="button"
                        disabled={outlinedButton?.disabled}
                        onClick={outlinedButton?.onClick}
                    >
                        {outlinedButton?.text}
                    </Button>
                )}
                {!(containButton?.included === false) && (
                    <Button
                        size="lg"
                        type={containButton?.type}
                        disabled={containButton?.disabled}
                        onClick={containButton?.onClick}
                    >
                        {containButton?.isLoading
                            ? containButton?.loadingText
                            : containButton?.disabled
                            ? containButton?.disabledText || containButton?.text
                            : containButton?.text}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Wrapper;
