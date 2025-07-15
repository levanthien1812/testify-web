import { useMemo } from "react";
import { FillGapsAnswerItf, FillGapsQuestionItf } from "../../../types/types";
import {
    FILL_GAP_INDICATOR,
    USER_ANSWER_STATUS,
} from "../../../config/constants/tests";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import TextFillWithInputs from "../../createTestPage/components/testAnswers/TextFillWithInputs";

type FillGapsAnswerProps = {
    questionContent: FillGapsQuestionItf;
    answerContent: FillGapsAnswerItf;
    answerStatus: USER_ANSWER_STATUS;
};

const FillGapsAnswer = ({
    questionContent,
    answerContent,
    answerStatus,
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

    return (
        <>
            <HtmlDisplay htmlContent={questionContent.text} />

            <TextFillWithInputs
                doc={JSON.parse(questionContent.json_text)}
                method={questionContent.fill_method}
                words={questionContent.given_words}
                givenAnswers={
                    answerContent
                        ? answerContent.gaps.reduce<Record<string, string>>(
                              (acc, gap, index) => {
                                  acc[`gap-${index + 1}`] = gap.text;
                                  return acc;
                              },
                              {}
                          )
                        : undefined
                }
                readonly={true}
            />

            {questionContent.answer && (
                <div className="mt-2 bg-green-500 p-2">
                    <p className="text-white">Correct answer:</p>
                    <div>{textReplacements} </div>
                </div>
            )}
        </>
    );
};

export default FillGapsAnswer;
