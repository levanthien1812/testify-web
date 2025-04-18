import { useMemo } from "react";
import { ResponseAnswerItf, ResponseQuestionItf } from "../../../types/types";

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
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: questionContent.text,
                }}
            ></div>

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
