import { ChangeEvent, useState } from "react";
import { QuestionItf, ResponseQuestionItf } from "../../../types/types";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";

type ResponseQuestionProps = {
    question: QuestionItf<ResponseQuestionItf>;
};

const ResponseQuestion = ({ question }: ResponseQuestionProps) => {
    const [response, setResponse] = useState<string>();
    const dispatch = useDispatch();

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (
            !question.content!.max_length ||
            e.target.value.length <= question.content!.max_length
        ) {
            setResponse(e.target.value);
            dispatch(
                takeTestActions.addAnswer({
                    question_id: question.id!,
                    content: { response: e.target.value },
                })
            );
        }
    };

    return (
        <>
            <HtmlDisplay htmlContent={question.content!.text} />
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
