import { ChangeEvent, useEffect, useState } from "react";
import { AnswerBody, FillGapsQuestionItf } from "../../../../types/types";
import { generateArray } from "../../../../utils/array";
import Input from "../../../../components/elements/Input";

type FillGapsAnswerProps = {
    content: FillGapsQuestionItf;
    reset: boolean;
    onProvideAnswer: (answerBody: AnswerBody) => void;
};

const FillGapsAnswer = ({
    content,
    onProvideAnswer,
    reset,
}: FillGapsAnswerProps) => {
    const [gaps, setGaps] = useState<string[]>(
        content.answer || Array(content.num_gaps).fill("")
    );

    const handleFillGap = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            let updatedGaps = [...gaps];
            let index = parseInt(e.target.name.split("-")[1]) - 1;
            updatedGaps[index] = e.target.value;
            setGaps(updatedGaps);
            onProvideAnswer({ answer: updatedGaps });
        }
    };

    useEffect(() => {
        if (reset === true)
            setGaps(content.answer || Array(content.num_gaps).fill(""));
    }, [reset]);

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text.replaceAll("***", "___"),
                }}
            ></div>

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
