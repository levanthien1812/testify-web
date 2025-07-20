import { useMemo } from "react";
import { ResponseAnswerItf, ResponseQuestionItf } from "../../../types/types";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import InstructionText from "../../createTestPage/components/testAnswers/InstructionText";

type ResponseAnswerProps = {
    questionContent: ResponseQuestionItf;
    answerContent: ResponseAnswerItf;
};

const ResponseAnswer = ({
    questionContent,
    answerContent,
}: ResponseAnswerProps) => {
    const response = useMemo(() => {
        if (answerContent === undefined) {
            return questionContent.answer?.response;
        } else if (answerContent !== null) {
            return answerContent.response;
        }

        return "";
    }, [questionContent, answerContent]);

    return (
        <div>
            <InstructionText text={questionContent.instruction_text} />
            <HtmlDisplay htmlContent={questionContent.text} />
            <textarea
                id="response"
                name="response"
                readOnly
                value={response}
                className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5 w-full mt-2"
                rows={6}
            ></textarea>
        </div>
    );
};

export default ResponseAnswer;
