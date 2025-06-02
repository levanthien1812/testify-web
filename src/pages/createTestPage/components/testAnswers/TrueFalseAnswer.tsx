import RadioList from "../../../../components/elements/RadioList";
import {
    ResponseQuestionItf,
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
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text,
                }}
            ></div>

            <RadioList
                name="is_true"
                options={[
                    { value: "true", label: "True" },
                    { value: "false", label: "False" },
                ]}
                selectedValue={String(content.answer?.is_true) || null}
                onChange={(is_true) => {
                    onProvideAnswer({
                        is_true: is_true === "true",
                        is_saved: false,
                    });
                }}
            />
        </>
    );
};

export default TrueFalseAnswer;
