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
            {additionalInfo && <div className="ms-4">{additionalInfo}</div>}
        </div>
    );
};

export default TestOption;
