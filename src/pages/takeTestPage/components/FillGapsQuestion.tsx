import { ChangeEvent, useState } from "react";
import { FillGapsQuestionItf, QuestionItf } from "../../../types/types";
import Input from "../../../components/elements/Input";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";

type FillGapsQuestionProps = {
    question: QuestionItf<FillGapsQuestionItf>;
};

const FillGapsQuestion = ({ question }: FillGapsQuestionProps) => {
    const [gaps, setGaps] = useState<string[]>([]);
    const dispatch = useDispatch();

    const handleFillGap = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            let updatedGaps = [...gaps];
            let index = parseInt(e.target.name.split("-")[1]) - 1;
            updatedGaps[index] = e.target.value;
            setGaps(updatedGaps);
            dispatch(
                takeTestActions.addAnswer({
                    question_id: question.id!,
                    content: { gaps },
                })
            );
        }
    };

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: question.content!.text.replaceAll("***", "___"),
                }}
            ></div>

            <div className="space-y-1 mt-2">
                {[...Array(question.content!.num_gaps)].map((num, index) => (
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

export default FillGapsQuestion;
