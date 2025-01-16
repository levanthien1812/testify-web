import { ResponseQuestionItf } from "../../../../types/types";

type ResponseAnswerProps = {
    content: ResponseQuestionItf;
};

const ResponseAnswer = ({ content }: ResponseAnswerProps) => {
    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text.replaceAll("***", "___"),
                }}
            ></div>

            <p className="text-sm text-gray-500 italic">
                You need to manually score student's answers for this question
            </p>
        </>
    );
};

export default ResponseAnswer;
