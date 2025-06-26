import React from "react";
import { QuestionBankItf } from "../../../types/questionBank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { questionTypeToIcon } from "../../../utils/mapping";

type PickQuestionsProps = {
    selectedBank: QuestionBankItf;
    currentBank: QuestionBankItf;
    selectedQuestions: string[];
    onSelectQuestion: (question: string) => void;
};

const PickQuestions = ({
    selectedBank,
    currentBank,
    selectedQuestions,
    onSelectQuestion,
}: PickQuestionsProps) => {
    const questionList = selectedBank.questions_detail.filter(
        (question) => !currentBank.questions.includes(question.id!)
    );

    return (
        <div>
            <div>
                Selected question bank:{" "}
                <span className="font-bold">{selectedBank.name}</span>
            </div>
            <p className="mt-2">Pick questions:</p>
            <p className="text-gray-500 italic">
                Some questions existing in the current bank ({currentBank.name})
                are not displayed!
            </p>
            <div className="grid grid-cols-3 gap-2 mt-1">
                {questionList.map((question) => (
                    <div
                        onClick={() => onSelectQuestion(question.id!)}
                        key={question.id}
                        className={`cursor-pointer relative px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm ${
                            selectedQuestions.includes(question.id!) &&
                            "border border-orange-500"
                        }`}
                    >
                        {selectedQuestions.includes(question.id!) && (
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
                            <div
                                className="text-md"
                                dangerouslySetInnerHTML={{
                                    __html: question.content!.text,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PickQuestions;
