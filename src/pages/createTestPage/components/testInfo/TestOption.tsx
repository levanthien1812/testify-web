import React from "react";

type TestOptionProps = {
    mainOption: React.ReactNode;
    subOptions: React.ReactNode[];
    additionalInfo?: React.ReactNode;
};

const TestOption = ({
    mainOption,
    subOptions,
    additionalInfo,
}: TestOptionProps) => {
    return (
        <div>
            <div className="flex justify-between items-center gap-2">
                {mainOption}
                <div className="flex flex-col gap-2 items-end">
                    {subOptions}
                </div>
            </div>
            {additionalInfo && (
                <div
                    className="sm:ms-4 px-2 py-1 sm:px-4 sm:py-2 bg-orange-50"
                    data-testid="additional-info"
                >
                    {additionalInfo}
                </div>
            )}
        </div>
    );
};

export default TestOption;
