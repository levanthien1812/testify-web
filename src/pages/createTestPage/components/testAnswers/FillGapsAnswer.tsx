import { ChangeEvent, useEffect, useState } from "react";
import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
} from "../../../../types/types";
import Input from "../../../../components/elements/Input";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";

type FillGapsAnswerProps = {
    content: FillGapsQuestionItf;
    reset: boolean;
    onProvideAnswer: (answerBody: FillGapsAnswerItf) => void;
};

const FillGapsAnswer = ({
    content,
    onProvideAnswer,
    reset,
}: FillGapsAnswerProps) => {
    const [gaps, setGaps] = useState<string[]>(
        content.answer?.gaps || Array(content.num_gaps).fill("")
    );

    const handleFillGap = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            let updatedGaps = [...gaps];
            let index = parseInt(e.target.name.split("-")[1]) - 1;
            updatedGaps[index] = e.target.value;
            setGaps(updatedGaps);
            onProvideAnswer({ ...content.answer, gaps: updatedGaps });
        }
    };

    useEffect(() => {
        if (reset === true)
            setGaps(content.answer?.gaps || Array(content.num_gaps).fill(""));
    }, [reset]);

    return (
        <>
            <HtmlDisplay htmlContent={content.text.replaceAll("***", "___")} />
            <div className="space-y-1 mt-2">
                {[...Array(content.num_gaps)].map((num, index) => (
                    <div className="flex gap-3 items-end ps-2" key={index + 1}>
                        <label
                            htmlFor={`gap${index + 1}`}
                            className="text-nowrap"
                        >
                            Gap {index + 1}:
                        </label>
                        <Input
                            type="text"
                            name={`gap-${index + 1}`}
                            value={gaps[index]}
                            id={`gap-${index + 1}`}
                            onChange={handleFillGap}
                            className="grow"
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default FillGapsAnswer;
