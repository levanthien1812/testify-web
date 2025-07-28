import {
    QuestionBankItf,
    QuestionInBankItf,
} from "../../../types/questionBank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { questionTypeToIcon } from "../../../utils/mapping";
import { QuestionContentItf } from "../../../types/types";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import InfoMessage from "../../../components/elements/InfoMessage";

type PickQuestionsFromBankProps = {
    selectedBank: QuestionBankItf;
    currentBank?: QuestionBankItf;
    currentQuestion?: QuestionInBankItf<QuestionContentItf>;
    selectedQuestions: QuestionInBankItf<QuestionContentItf>[];
    onSelectQuestion: (question: QuestionInBankItf<QuestionContentItf>) => void;
};

const PickQuestionsFromBank = ({
    selectedBank,
    currentBank,
    currentQuestion,
    selectedQuestions,
    onSelectQuestion,
}: PickQuestionsFromBankProps) => {
    const questionList = selectedBank.questions_detail.filter((question) =>
        currentBank
            ? !currentBank.questions.includes(question.id!)
            : currentQuestion
            ? question.id !== currentQuestion.id
            : true
    );

    const importedQuestions = currentBank
        ? currentBank.questions_detail
              .filter((question) => question.imported_from)
              .map((question) => question.imported_from!)
        : [];

    const isSelected = (question: QuestionInBankItf<QuestionContentItf>) => {
        return selectedQuestions.find((q) => q.id === question.id);
    };

    const isImported = (question: QuestionInBankItf<QuestionContentItf>) => {
        return importedQuestions.includes(question.id!);
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
                    ${currentBank.name}) are not displayed!`}
                />
            )}
            <div className="grid grid-cols-3 gap-2 mt-1">
                {questionList.map((question) => (
                    <div
                        onClick={() => {
                            if (isImported(question)) return;
                            onSelectQuestion(question);
                        }}
                        key={question.id}
                        className={`cursor-pointer relative px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm ${
                            isSelected(question) && "border border-orange-500"
                        } ${isImported(question) && "border border-gray-500"}`}
                    >
                        {(isSelected(question) || isImported(question)) && (
                            <span>
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className={`${
                                        isSelected(question) &&
                                        "text-orange-600"
                                    } ${
                                        isImported(question) && "text-gray-600"
                                    } absolute top-1 right-1`}
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
                                className="text-md grow"
                                maxLength={50}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PickQuestionsFromBank;
