import { useState } from "react";
import {
    QuestionBankItf,
    QuestionInBankItf,
} from "../../../types/questionBank";
import { useQuery } from "react-query";
import Modal, {
    ModalBody,
    ModalHeader,
} from "../../../components/modals/Modal";
import Button from "../../../components/elements/Button";
import Loading from "../../../components/loadings/Loading";
import {
    QuestionContentItf,
    QuestionItf,
    TestToImportQuestion,
} from "../../../types/types";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import { getTestsToImportQuestionToBank } from "../../../services/test";
import PickTest from "./PickTest";
import PickQuestionsFromTest from "./PickQuestionsFromTest";

enum IMPORT_STEP {
    SELECT_TEST = "SELECT_TEST",
    SELECT_QUESTIONS = "SELECT_QUESTIONS",
}

type ImportQuestionFromTestProps = {
    currentBank: QuestionBankItf;
    onClose: () => void;
    onConfirmQuestions: (
        questions: QuestionInBankItf<QuestionContentItf>[]
    ) => void;
};

const ImportQuestionFromTest = ({
    currentBank,
    onClose,
    onConfirmQuestions,
}: ImportQuestionFromTestProps) => {
    const [selectedTest, setSelectedTest] =
        useState<TestToImportQuestion | null>(null);
    const [selectedQuestions, setSelectedQuestions] = useState<
        QuestionItf<QuestionContentItf>[]
    >([]);
    const [currentStep, setCurrentStep] = useState<IMPORT_STEP>(
        IMPORT_STEP.SELECT_TEST
    );

    const { data: tests, isLoading: isLoadingTests } = useQuery<
        TestToImportQuestion[]
    >({
        queryKey: [QUERY_KEYS.GET_TESTS_TO_IMPORT_QUESTIONS_TO_BANK],
        queryFn: async () => {
            const data = await getTestsToImportQuestionToBank();
            return data.tests;
        },
    });

    const handleSelectTest = (bank: TestToImportQuestion) => {
        setSelectedTest(bank);
    };

    const handleClickConfirm = () => {
        if (currentStep === IMPORT_STEP.SELECT_TEST) {
            setCurrentStep(IMPORT_STEP.SELECT_QUESTIONS);
        } else if (currentStep === IMPORT_STEP.SELECT_QUESTIONS) {
            onConfirmQuestions(selectedQuestions);
        }
    };

    const handleSelectQuestion = (
        question: QuestionItf<QuestionContentItf>
    ) => {
        if (selectedQuestions.find((q) => q.id === question.id)) {
            setSelectedQuestions(
                selectedQuestions.filter((q) => q.id !== question.id)
            );
        } else {
            setSelectedQuestions([...selectedQuestions, question]);
        }
    };

    const handleClickBack = () => {
        setSelectedQuestions([]);
        setCurrentStep(IMPORT_STEP.SELECT_TEST);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Import Questions" />
            <ModalBody>
                <div className="py-2">
                    <Loading
                        isLoading={isLoadingTests}
                        loadingText={{ text: "Loading tests..." }}
                    />

                    {currentStep === IMPORT_STEP.SELECT_TEST && tests && (
                        <PickTest
                            tests={tests}
                            onSelectTest={handleSelectTest}
                            selectedTest={selectedTest}
                        />
                    )}
                    {currentStep === IMPORT_STEP.SELECT_QUESTIONS &&
                        selectedTest && (
                            <PickQuestionsFromTest
                                selectedTest={selectedTest}
                                onSelectQuestion={handleSelectQuestion}
                                selectedQuestions={selectedQuestions}
                                importedQuestions={
                                    currentBank.questions_detail &&
                                    currentBank.questions_detail
                                        .filter(
                                            (question) => question.imported_from
                                        )
                                        .map(
                                            (question) =>
                                                question.imported_from!
                                        )
                                }
                            />
                        )}
                </div>
                <div className="flex gap-2 border-t border-gray-200 pt-2">
                    <Button
                        secondary
                        type="button"
                        onClick={onClose}
                        className="ml-auto"
                    >
                        Cancel
                    </Button>

                    {currentStep === IMPORT_STEP.SELECT_QUESTIONS && (
                        <Button type="button" onClick={handleClickBack}>
                            Back
                        </Button>
                    )}

                    {tests && tests.length > 0 && (
                        <Button
                            type="button"
                            onClick={handleClickConfirm}
                            disabled={
                                currentStep === IMPORT_STEP.SELECT_TEST
                                    ? !selectedTest
                                    : currentStep ===
                                      IMPORT_STEP.SELECT_QUESTIONS
                                    ? selectedQuestions.length === 0
                                    : false
                            }
                        >
                            {currentStep === IMPORT_STEP.SELECT_TEST
                                ? "Next"
                                : "Confirm"}
                        </Button>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ImportQuestionFromTest;
