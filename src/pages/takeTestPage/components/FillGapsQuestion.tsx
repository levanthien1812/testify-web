import { FillGapsQuestionItf, QuestionItf } from "../../../types/types";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import TextFillWithInputs from "../../createTestPage/components/testAnswers/TextFillWithInputs";

type FillGapsQuestionProps = {
    question: QuestionItf<FillGapsQuestionItf>;
};

const FillGapsQuestion = ({ question }: FillGapsQuestionProps) => {
    const dispatch = useDispatch();

    const handleChangeAnswers = (answers: Record<string, string>) => {
        dispatch(
            takeTestActions.addAnswer({
                question_id: question.id!,
                content: {
                    gaps: Object.keys(answers).map((key) => ({
                        id: key,
                        text: answers[key],
                    })),
                },
            })
        );
    };

    return (
        <>
            <HtmlDisplay htmlContent={question.content!.text} />
            <TextFillWithInputs
                doc={JSON.parse(question.content!.json_text)}
                method={question.content!.fill_method}
                words={question.content!.given_words}
                onAnswersChange={handleChangeAnswers}
            />
        </>
    );
};

export default FillGapsQuestion;
