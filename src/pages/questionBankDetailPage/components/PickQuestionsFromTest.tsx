import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { questionTypeToIcon } from "../../../utils/mapping";
import {
    QuestionContentItf,
    QuestionItf,
    TestToImportQuestion,
} from "../../../types/types";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";

type PickQuestionsFromTestProps = {
    selectedTest: TestToImportQuestion;
    selectedQuestions: QuestionItf<QuestionContentItf>[];
    onSelectQuestion: (question: QuestionItf<QuestionContentItf>) => void;
    importedQuestions?: string[];
};

const PickQuestionsFromTest = ({
    selectedTest,
    selectedQuestions,
    onSelectQuestion,
    importedQuestions = [],
}: PickQuestionsFromTestProps) => {
    const questionList = selectedTest.questions!;

    const isSelected = (question: QuestionItf<QuestionContentItf>) => {
        return selectedQuestions.find((q) => q.id === question.id);
    };

    const isImported = (question: QuestionItf<QuestionContentItf>) => {
        return importedQuestions.includes(question.id!);
    };

    return (
        <div>
            <div>
                Selected test:{" "}
                <span className="font-bold">{selectedTest.title}</span>
            </div>
            <p className="mt-2">Pick questions:</p>
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

export default PickQuestionsFromTest;
