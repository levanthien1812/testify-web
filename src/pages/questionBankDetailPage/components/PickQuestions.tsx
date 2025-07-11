import React from "react";
import {
    QuestionBankItf,
    QuestionInBankItf,
} from "../../../types/questionBank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { questionTypeToIcon } from "../../../utils/mapping";
import { QuestionContentItf, QuestionItf } from "../../../types/types";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import InfoMessage from "../../../components/elements/InfoMessage";

type PickQuestionsProps = {
    selectedBank: QuestionBankItf;
    currentBank?: QuestionBankItf;
    currentQuestion?: QuestionInBankItf<QuestionContentItf>;
    selectedQuestions: QuestionInBankItf<QuestionContentItf>[];
    onSelectQuestion: (question: QuestionInBankItf<QuestionContentItf>) => void;
};

const PickQuestions = ({
    selectedBank,
    currentBank,
    currentQuestion,
    selectedQuestions,
    onSelectQuestion,
}: PickQuestionsProps) => {
    const questionList = selectedBank.questions_detail.filter((question) =>
        currentBank
            ? !currentBank.questions.includes(question.id!)
            : currentQuestion
            ? question.id !== currentQuestion.id
            : true
    );

    return (
        <div>
            <div>
                Selected question bank:{" "}
                <span className="font-bold">{selectedBank.name}</span>
            </div>
            <p className="mt-2">Pick questions:</p>
            {currentBank && (
                <InfoMessage
                    message={`Some questions existing in the current bank (
                    ${currentBank.name}) are not displayed!`}
                />
            )}
            <div className="grid grid-cols-3 gap-2 mt-1">
                {questionList.map((question) => (
                    <div
                        onClick={() => onSelectQuestion(question)}
                        key={question.id}
                        className={`cursor-pointer relative px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm ${
                            selectedQuestions.find(
                                (q) => q.id === question.id
                            ) && "border border-orange-500"
                        }`}
                    >
                        {selectedQuestions.find(
                            (q) => q.id === question.id
                        ) && (
                            <span>
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-orange-600 absolute top-1 right-1"
                                />
                            </span>
                        )}
                        <div className="flex gap-2 items-start">
                            <span className="bg-orange-200 rounded-md p-1 leading-none ml-auto">
                                <FontAwesomeIcon
                                    icon={questionTypeToIcon[question.type]}
                                    className="text-gray-700"
                                />
                            </span>
                            <HtmlDisplay
                                htmlContent={question.content!.text}
                                className="text-md"
                                maxLength={50}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PickQuestions;
