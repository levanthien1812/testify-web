import { ChangeEvent, useState } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
    QuestionItf,
} from "../../../types/types";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import InstructionText from "../../createTestPage/components/testAnswers/InstructionText";

type MultipleChoicesQuestionProps = {
    question: QuestionItf<MultipleChoiceQuestionItf>;
};

const MultipleChoicesQuestion = ({
    question,
}: MultipleChoicesQuestionProps) => {
    const [optionsChosen, setOptionsChosen] = useState<string[]>([]);
    const dispatch = useDispatch();

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setOptionsChosen([e.target.value]);
            dispatch(
                takeTestActions.addAnswer({
                    question_id: question.id!,
                    content: { options: [e.target.value] },
                })
            );
        }
    };

    const handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedOptions = e.target.checked
            ? [...optionsChosen, e.target.value]
            : optionsChosen.filter((option) => option !== e.target.value);
        setOptionsChosen(updatedOptions);
        dispatch(
            takeTestActions.addAnswer({
                question_id: question.id!,
                content: { options: updatedOptions },
            })
        );
    };

    return (
        <>
            <InstructionText text={question.content!.instruction_text} />
            <HtmlDisplay htmlContent={question.content!.text} />

            <div className="space-y-1 mt-2">
                {question.content!.options.map((option) => (
                    <div
                        className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer"
                        key={option.id}
                    >
                        {!question.content!.allow_multiple && (
                            <input
                                type="radio"
                                name={question.content!.id}
                                value={option.id}
                                id={option.id}
                                onChange={handleChangeRadio}
                                checked={optionsChosen[0] === option.id}
                            />
                        )}
                        {question.content!.allow_multiple && (
                            <input
                                type="checkbox"
                                name={option.id}
                                value={option.id}
                                id={option.id}
                                onChange={handleChangeCheckbox}
                                checked={
                                    option.id
                                        ? optionsChosen.includes(option.id)
                                        : false
                                }
                            />
                        )}
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
