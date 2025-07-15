import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import InfoMessage from "../../../../components/elements/InfoMessage";
import { ResponseQuestionItf } from "../../../../types/types";

type ResponseAnswerProps = {
    content: ResponseQuestionItf;
};

const ResponseAnswer = ({ content }: ResponseAnswerProps) => {
    return (
        <>
            <HtmlDisplay htmlContent={content.text} />

            <InfoMessage message="You need to manually score student's answers for this question" />
        </>
    );
};

export default ResponseAnswer;
