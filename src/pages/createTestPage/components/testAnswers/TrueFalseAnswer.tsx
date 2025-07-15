import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import RadioList from "../../../../components/elements/RadioList";
import {
    TrueFalseAnswerItf,
    TrueFalseQuestionItf,
} from "../../../../types/types";

type TrueFalseAnswerProps = {
    content: TrueFalseQuestionItf;
    reset: boolean;
    onProvideAnswer: (answerBody: TrueFalseAnswerItf) => void;
};

const TrueFalseAnswer = ({
    content,
    onProvideAnswer,
    reset,
}: TrueFalseAnswerProps) => {
    return (
        <>
            <HtmlDisplay htmlContent={content.text} />

            <RadioList
                name={`${content.id}_is_true`}
                options={[
                    { value: "true", label: "True" },
                    { value: "false", label: "False" },
                ]}
                selectedValue={
                    content.answer ? `${content.answer.is_true}` : null
                }
                onChange={(is_true) => {
                    onProvideAnswer({
                        ...content.answer,
                        is_true: is_true === "true",
                        is_saved: false,
                    });
                }}
            />
        </>
    );
};

export default TrueFalseAnswer;
