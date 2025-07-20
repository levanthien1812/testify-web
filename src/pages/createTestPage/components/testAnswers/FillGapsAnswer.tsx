import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
    GivenAnswersTextFill,
} from "../../../../types/types";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import TextFillWithInputs from "./TextFillWithInputs";
import InstructionText from "./InstructionText";

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
    const handleChangeAnswers = (answers: GivenAnswersTextFill) => {
        onProvideAnswer({
            gaps: Object.keys(answers).map((key) => ({
                id: key,
                text: answers[key].value,
            })),
        });
    };

    return (
        <>
            <InstructionText text={content.instruction_text} />
            <HtmlDisplay htmlContent={content.text} />
            <TextFillWithInputs
                doc={JSON.parse(content.json_text)}
                method={content.fill_method}
                words={content.given_words}
                onAnswersChange={handleChangeAnswers}
                givenAnswers={content.answer?.gaps.reduce<GivenAnswersTextFill>(
                    (acc, gap, index) => {
                        acc[`gap-${index + 1}`] = { value: gap.text };
                        return acc;
                    },
                    {}
                )}
            />
        </>
    );
};

export default FillGapsAnswer;
