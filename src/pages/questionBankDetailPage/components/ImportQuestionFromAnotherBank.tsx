import { useState } from "react";
import {
    QuestionBankItf,
    QuestionInBankItf,
} from "../../../types/questionBank";
import { useQuery } from "react-query";
import {
    getQuestionBank,
    getQuestionBanks,
} from "../../../services/questionBank";
import Modal, {
    ModalBody,
    ModalHeader,
} from "../../../components/modals/Modal";
import Button from "../../../components/elements/Button";
import PickBank from "./PickBank";
import PickQuestions from "./PickQuestions";
import Loading from "../../../components/loadings/Loading";
import { QuestionContentItf, QuestionItf } from "../../../types/types";

enum IMPORT_STEP {
    SELECT_BANK = "SELECT_BANK",
    SELECT_QUESTIONS = "SELECT_QUESTIONS",
}

type ImportQuestionFromAnotherBankProps = {
    currentBank?: QuestionBankItf;
    currentQuestion?: QuestionItf<QuestionContentItf>;
    onClose: () => void;
    onConfirmQuestions: (
        questions: QuestionInBankItf<QuestionContentItf>[]
    ) => void;
};

const ImportQuestionFromAnotherBank = ({
    currentBank,
    currentQuestion,
    onClose,
    onConfirmQuestions,
}: ImportQuestionFromAnotherBankProps) => {
    const [selectedBank, setSelectedBank] = useState<QuestionBankItf | null>(
        null
    );
    const [selectedQuestions, setSelectedQuestions] = useState<
        QuestionInBankItf<QuestionContentItf>[]
    >([]);
    const [currentStep, setCurrentStep] = useState<IMPORT_STEP>(
        IMPORT_STEP.SELECT_BANK
    );

    const { data: questionBanks, isLoading: isLoadingQuestionBanks } = useQuery<
        QuestionBankItf[]
    >({
        queryKey: ["questionBanks"],
        queryFn: async () => {
            const data: { questionBanks: QuestionBankItf[] } =
                await getQuestionBanks();
            return data.questionBanks.filter((bank) =>
                currentBank ? bank.id !== currentBank.id : true
            );
        },
    });

    const {
        data: selectedBankDetail,
        isLoading: isLoadingSelectedBankDetail,
        refetch: refetchSelectedBankDetail,
    } = useQuery<QuestionBankItf>({
        queryKey: ["questionBank", "importQuestions"],
        queryFn: async () => {
            if (!selectedBank) {
                return null;
            }
            const data = await getQuestionBank(selectedBank.id);
            return {
                ...data.questionBank,
                questions_detail: data.questionBank.questions,
                questions: data.questionBank.questions.map(
                    (question: any) => question.id
                ),
            };
        },
        enabled: false,
    });

    const handleSelectBank = (bank: QuestionBankItf) => {
        setSelectedBank(bank);
    };

    const handleClickConfirm = () => {
        if (currentStep === IMPORT_STEP.SELECT_BANK) {
            setCurrentStep(IMPORT_STEP.SELECT_QUESTIONS);
            refetchSelectedBankDetail();
        } else if (currentStep === IMPORT_STEP.SELECT_QUESTIONS) {
            onConfirmQuestions(selectedQuestions);
        }
    };

    const handleSelectQuestion = (
        question: QuestionInBankItf<QuestionContentItf>
    ) => {
        if (currentBank) {
            if (selectedQuestions.find((q) => q.id === question.id)) {
                setSelectedQuestions(
                    selectedQuestions.filter((q) => q.id !== question.id)
                );
            } else {
                setSelectedQuestions([...selectedQuestions, question]);
            }
        }
        if (currentQuestion) {
            setSelectedQuestions([question]);
        }
    };

    const handleClickBack = () => {
        setSelectedQuestions([]);
        setCurrentStep(IMPORT_STEP.SELECT_BANK);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Import Questions" />
            <ModalBody>
                <div className="py-2">
                    <Loading
                        isLoading={isLoadingQuestionBanks}
                        loadingText={{ text: "Loading question banks..." }}
                    />
                    <Loading
                        isLoading={isLoadingSelectedBankDetail}
                        loadingText={{
                            text: "Loading selected bank's questions...",
                        }}
                    />

                    {currentStep === IMPORT_STEP.SELECT_BANK &&
                        questionBanks && (
                            <PickBank
                                banks={questionBanks}
                                onSelectBank={handleSelectBank}
                                selectedBank={selectedBank}
                            />
                        )}
                    {currentStep === IMPORT_STEP.SELECT_QUESTIONS &&
                        selectedBankDetail && (
                            <PickQuestions
                                selectedBank={selectedBankDetail}
                                currentBank={currentBank}
                                currentQuestion={currentQuestion}
                                onSelectQuestion={handleSelectQuestion}
                                selectedQuestions={selectedQuestions}
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

                    <Button
                        type="button"
                        onClick={handleClickConfirm}
                        disabled={
                            currentStep === IMPORT_STEP.SELECT_BANK
                                ? !selectedBank
                                : currentStep === IMPORT_STEP.SELECT_QUESTIONS
                                ? selectedQuestions.length === 0
                                : false
                        }
                    >
                        {currentStep === IMPORT_STEP.SELECT_BANK
                            ? "Next"
                            : "Confirm"}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ImportQuestionFromAnotherBank;
