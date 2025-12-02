import { useMemo } from "react";
import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
    GivenAnswersTextFill,
} from "../../../types/types";
import {
    FILL_GAP_INDICATOR,
    USER_ANSWER_STATUS,
} from "../../../config/constants/tests";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import TextFillWithInputs from "../../createTestPage/components/testAnswers/TextFillWithInputs";
import InstructionText from "../../createTestPage/components/testAnswers/InstructionText";

type FillGapsAnswerProps = {
    questionContent: FillGapsQuestionItf;
    answerContent: FillGapsAnswerItf;
    answerStatus: USER_ANSWER_STATUS;
    includeUserAnswer?: boolean;
};

const FillGapsAnswer = ({
    questionContent,
    answerContent,
    answerStatus,
    includeUserAnswer,
}: FillGapsAnswerProps) => {
    const textReplacements = useMemo(() => {
        if (!questionContent.answer) return "";

        const subStrings = questionContent.text.split(FILL_GAP_INDICATOR);
        const filledText = subStrings.map((subString, index) => {
            if (index === 0) return <span>{subString}</span>;
            return (
                <span key={index}>
                    {" "}
                    <span className="text-white underline font-bold">
                        {questionContent.answer?.gaps?.[index - 1].text}
                    </span>{" "}
                    <span>{subString}</span>
                </span>
            );
        });

        return <p className="text-white">{filledText}</p>;
    }, [questionContent]);

    const givenAnswers = useMemo(() => {
        if (!includeUserAnswer && questionContent.answer)
            return questionContent.answer.gaps.reduce<GivenAnswersTextFill>(
                (acc, gap, index) => {
                    acc[gap.id || `gap-${index + 1}`] = {
                        value: gap.text,
                        status: "correct",
                    };
                    return acc;
                },
                {}
            );
        if (answerContent) {
            return answerContent.gaps.reduce<GivenAnswersTextFill>(
                (acc, gap, index) => {
                    acc[gap.id || `gap-${index + 1}`] = {
                        value: gap.text,
                        status:
                            gap.is_correct === undefined
                                ? "normal"
                                : gap.is_correct === true
                                ? "correct"
                                : "wrong",
                    };
                    return acc;
                },
                {}
            );
        }
        return undefined;
    }, [answerContent, includeUserAnswer, questionContent.answer]);

    return (
        <>
            <InstructionText text={questionContent.instruction_text} />
            <HtmlDisplay htmlContent={questionContent.text} />

            <TextFillWithInputs
                doc={JSON.parse(questionContent.json_text)}
                method={questionContent.fill_method}
                words={questionContent.given_words}
                givenAnswers={givenAnswers}
                readonly={true}
            />

            {questionContent.answer &&
                answerStatus !== USER_ANSWER_STATUS.CORRECT &&
                includeUserAnswer && (
                    <div className="mt-2 bg-green-500 p-2">
                        <p className="text-white">Correct answer:</p>
                        <div>{textReplacements} </div>
                    </div>
                )}
        </>
    );
};

export default FillGapsAnswer;
