import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import InfoMessage from "../../../../components/elements/InfoMessage";
import { ResponseQuestionItf } from "../../../../types/types";
import InstructionText from "./InstructionText";

type ResponseAnswerProps = {
    content: ResponseQuestionItf;
};

const ResponseAnswer = ({ content }: ResponseAnswerProps) => {
    return (
        <>
            <InstructionText text={content.instruction_text} />
            <HtmlDisplay htmlContent={content.text} />

            <InfoMessage message="You need to manually score student's answers for this question" />
        </>
    );
};

export default ResponseAnswer;
