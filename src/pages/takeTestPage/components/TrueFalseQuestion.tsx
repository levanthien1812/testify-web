import { ChangeEvent } from "react";
import { TrueFalseQuestionItf, QuestionItf } from "../../../types/types";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";

type TrueFalseQuestionProps = {
    question: QuestionItf<TrueFalseQuestionItf>;
};

const TrueFalseQuestion = ({ question }: TrueFalseQuestionProps) => {
    const dispatch = useDispatch();

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            dispatch(
                takeTestActions.addAnswer({
                    question_id: question.id!,
                    content: { is_true: e.target.value === "true" },
                })
            );
        }
    };

    return (
        <>
            <HtmlDisplay htmlContent={question.content!.text} />

            <div className="flex gap-1 mt-2">
                {[true, false].map((option) => (
                    <div className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer">
                        <input
                            type="radio"
                            name={question.content!.id}
                            value={`${option}`}
                            id={`${option}`}
                            onChange={handleChangeRadio}
                            checked={
                                question.content!.answer?.is_true === option
                            }
                        />
                        <label htmlFor={`${option}`} className="grow">
                            {option ? "True" : "False"}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
};

export default TrueFalseQuestion;
