import React from "react";
import {
    QuestionInBankItf,
    QuestionBankItf,
} from "../../../types/questionBank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { questionTypeToIcon } from "../../../utils/mapping";
import { QuestionContentItf } from "../../../types/types";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import InfoMessage from "../../../components/elements/InfoMessage";
import CardPicker from "../../../components/pickers/CardPicker";

type PickQuestionsFromBankProps = {
    selectedBank: QuestionBankItf;
    currentBank?: QuestionBankItf;
    currentQuestion?: QuestionInBankItf<QuestionContentItf>;
    selectedQuestions: QuestionInBankItf<QuestionContentItf>[];
    onSelectQuestions: (
        questions: QuestionInBankItf<QuestionContentItf>[],
    ) => void;
};

const PickQuestionsFromBank = ({
    selectedBank,
    currentBank,
    currentQuestion,
    selectedQuestions,
    onSelectQuestions,
}: PickQuestionsFromBankProps) => {
    const questionList = selectedBank.questions_detail.filter((question) =>
        currentBank
            ? !currentBank.questions.includes(question.id!)
            : currentQuestion
              ? question.id !== currentQuestion.id
              : true,
    );

    const importedQuestions = currentBank
        ? currentBank.questions_detail
              .filter((question) => question.imported_from)
              .map((question) => question.imported_from!)
        : [];

    const selectedQuestionIds = selectedQuestions.map((q) => q.id || "");

    const handleSelectionChange = (
        _ids: string[],
        selectedItems: QuestionInBankItf<QuestionContentItf>[],
    ) => {
        onSelectQuestions(selectedItems);
    };

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
                    ${currentBank.name}) are disabled!`}
                />
            )}
            <CardPicker
                items={questionList}
                selectedIds={selectedQuestionIds}
                disabledIds={importedQuestions}
                onSelectionChange={handleSelectionChange}
                getItemId={(question) => question.id || ""}
                renderCard={(question) => (
                    <div className="px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm transition">
                        <div className="flex gap-2 items-start">
                            <span className="bg-orange-200 rounded-md p-1 leading-none">
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-gray-700"
                                />
                            </span>
                            <HtmlDisplay
                                htmlContent={question.content!.text}
                                className="text-md grow"
                                maxLength={50}
                            />
                        </div>
                    </div>
                )}
                renderIndicator={(_question, isSelected, isDisabled) => (
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={`${
                            isSelected && "text-orange-600"
                        } ${isDisabled && "text-gray-600"} absolute top-1 right-1`}
                    />
                )}
                multiSelect={currentQuestion ? false : true}
                emptyMessage="No questions available from this bank"
                disabledCardClassName="border border-gray-500 opacity-60 cursor-not-allowed"
            />
        </div>
    );
};

export default PickQuestionsFromBank;
