import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { questionTypeToIcon } from "../../../utils/mapping";
import {
    QuestionContentItf,
    QuestionItf,
    TestToImportQuestion,
} from "../../../types/types";
import CardPicker from "../../../components/pickers/CardPicker";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";

type PickQuestionsFromTestProps = {
    selectedTest: TestToImportQuestion;
    selectedQuestions: QuestionItf<QuestionContentItf>[];
    onSelectQuestions: (questions: QuestionItf<QuestionContentItf>[]) => void;
    importedQuestions?: string[];
};

const PickQuestionsFromTest = ({
    selectedTest,
    selectedQuestions,
    onSelectQuestions,
    importedQuestions = [],
}: PickQuestionsFromTestProps) => {
    const questionList = selectedTest.questions!;
    const selectedQuestionIds = selectedQuestions.map((q) => q.id || "");

    const handleSelectionChange = (
        _ids: string[],
        selectedItems: QuestionItf<QuestionContentItf>[],
    ) => {
        onSelectQuestions(selectedItems);
    };

    return (
        <div>
            <div>
                Selected test:{" "}
                <span className="font-bold">{selectedTest.title}</span>
            </div>
            <p className="mt-2">Pick questions:</p>
            <CardPicker
                items={questionList}
                selectedIds={selectedQuestionIds}
                disabledIds={importedQuestions}
                onSelectionChange={handleSelectionChange}
                getItemId={(question) => question.id || ""}
                renderCard={(question) => (
                    <div className="px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm transition h-full">
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
                )}
                multiSelect={true}
                emptyMessage="No questions available from this test"
                disabledCardClassName="border border-gray-500 opacity-60 cursor-not-allowed"
            />
        </div>
    );
};

export default PickQuestionsFromTest;
