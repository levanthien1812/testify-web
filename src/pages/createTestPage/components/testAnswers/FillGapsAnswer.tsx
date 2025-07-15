import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
} from "../../../../types/types";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import TextFillWithInputs from "./TextFillWithInputs";

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
    const handleChangeAnswers = (answers: Record<string, string>) => {
        onProvideAnswer({
            gaps: Object.keys(answers).map((key) => ({
                id: key,
                text: answers[key],
            })),
        });
    };

    return (
        <>
            <HtmlDisplay htmlContent={content.text} />
            <TextFillWithInputs
                doc={JSON.parse(content.json_text)}
                method={content.fill_method}
                words={content.given_words}
                onAnswersChange={handleChangeAnswers}
                givenAnswers={content.answer?.gaps.reduce<
                    Record<string, string>
                >((acc, gap, index) => {
                    acc[`gap-${index + 1}`] = gap.text;
                    return acc;
                }, {})}
            />
        </>
    );
};

export default FillGapsAnswer;
