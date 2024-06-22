import { ChangeEvent, useEffect, useState } from "react";
import { AnswerBody, ResponseQuestionItf } from "../../../types/types";
import { generateArray } from "../../../utils/array";

type ResponseQuestionProps = {
    content: ResponseQuestionItf;
    onProvideAnswer: (answer: string) => void;
};

const ResponseQuestion = ({
    content,
    onProvideAnswer,
}: ResponseQuestionProps) => {
    const [response, setResponse] = useState<string>();

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!content.maxLength || e.target.value.length <= content.maxLength) {
            setResponse(e.target.value);
            onProvideAnswer(e.target.value);
        }
    };

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text.replaceAll("***", "___"),
                }}
            ></div>

            <textarea
                id="response"
                name="response"
                onChange={handleChange}
                value={response}
                className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5 w-full"
                rows={6}
                placeholder="Write your answer here..."
            ></textarea>
        </>
    );
};

export default ResponseQuestion;
