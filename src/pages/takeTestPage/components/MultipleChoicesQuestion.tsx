import { ChangeEvent, useState } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
    QuestionItf,
} from "../../../types/types";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";

type MultipleChoicesQuestionProps = {
    question: QuestionItf<MultipleChoiceQuestionItf>;
};

const MultipleChoicesQuestion = ({
    question,
}: MultipleChoicesQuestionProps) => {
    const [optionChosen, setOptionChosen] = useState<string>();
    const dispatch = useDispatch();

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setOptionChosen(e.target.value);
            dispatch(
                takeTestActions.addAnswer({
                    question_id: question.id!,
                    content: { options: [e.target.value] },
                })
            );
        }
    };

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{ __html: question.content!.text }}
            ></div>

            <div className="space-y-1 mt-2">
                {question.content!.options.map((option) => (
                    <div
                        className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer"
                        key={option.id}
                    >
                        <input
                            type="radio"
                            name={question.content!.id}
                            value={option.id}
                            id={option.id}
                            onChange={handleChangeRadio}
                            checked={optionChosen === option.id}
                        />
                        <label htmlFor={option.id} className="grow">
                            {option.text}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
};

export default MultipleChoicesQuestion;
