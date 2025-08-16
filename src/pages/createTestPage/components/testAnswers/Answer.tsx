import React, { useState } from "react";
import {
    AnswerContentItf,
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionContentItf,
    QuestionItf,
    ResponseQuestionItf,
    TrueFalseQuestionItf,
} from "../../../../types/types";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import { useMutation } from "react-query";
import { addAnswer } from "../../../../services/test";
import ResponseAnswer from "./ResponseAnswer";
import Button from "../../../../components/elements/Button";
import { QUESTION_TYPE } from "../../../../config/constants/tests";
import { createTestActions } from "../../../../stores/createTest";
import { useDispatch } from "react-redux";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";
import TrueFalseAnswer from "./TrueFalseAnswer";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import { getRound } from "../../../../utils/primitives";
import { getTextToAskAI } from "../../../../utils/test";
import AIAssistant from "./AIAssistant";
import { useChatSocket } from "../../../chatPage/components/ChatSocketContext";
import { useAppSelector } from "../../../../hooks/hooks";

const Answer: React.FC<{
    question: QuestionItf<QuestionContentItf>;
}> = ({ question }) => {
    const [savable, setSavable] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const { saveTestQuestions } = createTestActions;
    const [isAddingExplaination, setIsAddingExplaination] =
        useState<boolean>(false);
    const [contentTemp, setContentTemp] = useState<QuestionContentItf>(
        question.content!
    );
    const dispatch = useDispatch();
    const [isAskingAI, setIsAskingAI] = useState<boolean>(false);
    const [textToAsk, setTextToAsk] = useState<string>("");
    const { setCurrentAIChat } = useChatSocket();
    const { user } = useAppSelector((state) => state.auth);

    const { mutate, isLoading } = useMutation({
        mutationFn: async () =>
            await addAnswer(
                question.test_id,
                question.id!,
                contentTemp.answer as AnswerContentItf
            ),
        mutationKey: [MUTATION_KEYS.ADD_ANSWER, { question_id: question.id }],
        onSuccess: (data) => {
            setSavable(false);
            toast.success(TOAST_MESSAGES.ADD_ANSWER_SUCCESSFULLY);
            dispatch(
                saveTestQuestions({
                    ...question,
                    content: {
                        ...contentTemp,
                        answer: { ...contentTemp.answer, is_saved: true },
                    } as QuestionContentItf,
                })
            );
            setIsAddingExplaination(false);
        },
    });

    const handleProvideAnswer = (answerBody: AnswerContentItf) => {
        console.log(answerBody);
        setReset(false);
        setContentTemp(
            (prev) =>
                ({
                    ...prev,
                    answer: answerBody,
                } as QuestionContentItf)
        );
        setSavable(true);
    };

    const handleSaveAnswer = () => {
        mutate();
    };

    const handleExplainationChange = (value: string) => {
        if (value.length > 0) {
            setSavable(true);
        }
        setContentTemp({
            ...contentTemp,
            answer: {
                ...contentTemp.answer,
                explaination: value,
            },
        } as QuestionContentItf);
    };

    const handleCancel = () => {
        setReset(true);
        setContentTemp(question.content!);
        setSavable(false);
        setIsAddingExplaination(false);
    };

    const handleClickAskAI = () => {
        setIsAskingAI(true);
        setCurrentAIChat({
            chat_name: "Ask AI",
            messages: [],
            created_at: new Date().toISOString(),
            user_id: user!.id,
        });
        const textToAskAI = getTextToAskAI(question);
        if (!textToAskAI) return;
        setTextToAsk(textToAskAI);
    };

    return (
        <div>
            <div className="flex justify-start items-center">
                <p
                    className={`px-2 text-white ${
                        contentTemp.answer?.is_saved
                            ? "bg-orange-600"
                            : "bg-gray-600"
                    } w-fit`}
                >
                    Question {question.order}{" "}
                    <span className="italic">
                        ({getRound(question.score)} points)
                    </span>{" "}
                    :
                </p>
                {contentTemp.answer?.is_saved && (
                    <p className="text-orange-600 italic ms-1">Saved</p>
                )}
                <div className="ms-auto">
                    <Button link onClick={handleClickAskAI}>
                        Ask AI
                    </Button>
                </div>
            </div>

            <div className={`px-2 py-2 bg-orange-50 border border-gray-400`}>
                {question.type === QUESTION_TYPE.MULTIPLE_CHOICES && (
                    <MultipleChoicesAnswer
                        reset={reset}
                        content={contentTemp as MultipleChoiceQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === QUESTION_TYPE.FILL_IN_THE_GAPS && (
                    <FillGapsAnswer
                        reset={reset}
                        content={contentTemp as FillGapsQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === QUESTION_TYPE.MATCHING && (
                    <MatchingAnswer
                        reset={reset}
                        content={contentTemp as MatchingQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === QUESTION_TYPE.RESPONSE && (
                    <ResponseAnswer
                        content={contentTemp as ResponseQuestionItf}
                    />
                )}
                {question.type === QUESTION_TYPE.TRUE_FALSE && (
                    <TrueFalseAnswer
                        reset={reset}
                        content={contentTemp as TrueFalseQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
            </div>

            {isAddingExplaination && (
                <div className="mt-2">
                    <div className="flex gap-2 mb-1 items-center">
                        <p className="">Explaination:</p>
                        <Button
                            outlined
                            onClick={() => setIsAddingExplaination(false)}
                            size="sm"
                            className="ms-auto"
                        >
                            Close
                        </Button>
                    </div>
                    <TextEditor
                        content={contentTemp.answer?.explaination || ""}
                        setContent={handleExplainationChange}
                    />
                </div>
            )}

            {!contentTemp?.answer?.explaination && !isAddingExplaination && (
                <div className="mt-1">
                    <Button
                        outlined
                        size="sm"
                        onClick={() => setIsAddingExplaination(true)}
                    >
                        Add explaination
                    </Button>
                </div>
            )}

            {contentTemp.answer?.explaination && !isAddingExplaination && (
                <div className="mt-2">
                    <div className="flex gap-2 mb-1 items-center">
                        <p className="">Explaination:</p>
                        {!isAddingExplaination && (
                            <Button
                                outlined
                                size="sm"
                                onClick={() => setIsAddingExplaination(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                    <HtmlDisplay
                        htmlContent={contentTemp.answer.explaination}
                        className="bg-orange-50 border border-gray-400 p-2"
                    />
                </div>
            )}

            {savable && (
                <div className="flex mt-2 gap-2 justify-end items-center">
                    <Button secondary onClick={handleCancel} size="sm">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveAnswer}
                        disabled={isLoading}
                        type="submit"
                        size="sm"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            )}

            {isAskingAI && (
                <AIAssistant
                    message={textToAsk}
                    onClose={() => setIsAskingAI(false)}
                />
            )}
        </div>
    );
};

export default Answer;
