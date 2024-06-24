import { useMemo } from "react";
import { ResponseAnswerItf, ResponseQuestionItf } from "../../../types/types";

type ResponseAnswerProps = {
    content: ResponseQuestionItf;
    userAnswer: ResponseAnswerItf | null;
};

const ResponseAnswer = ({ content, userAnswer }: ResponseAnswerProps) => {
    const response = useMemo(() => {
        if (userAnswer === undefined) {
            return content.answer;
        } else if (userAnswer !== null) {
            return userAnswer.answer;
        }

        return "";
    }, [userAnswer]);

    return (
        <div>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text,
                }}
            ></div>

            <textarea
                id="response"
                name="response"
                readOnly
                value={response}
                className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5 w-full"
                rows={6}
            ></textarea>
        </div>
    );
};

export default ResponseAnswer;
