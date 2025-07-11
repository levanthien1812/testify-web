import React, { useState } from "react";
import Header from "./components/Header";
import {
    getQuestionBank,
    importQuestionToBank,
} from "../../services/questionBank";
import { useLocation, useParams } from "react-router";
import { QuestionBankItf, QuestionInBankItf } from "../../types/questionBank";
import { useMutation, useQuery } from "react-query";
import Loading from "../../components/loadings/Loading";
import Questions from "./components/Questions";
import CreateQuestion from "./components/CreateQuestion";
import ImportQuestionFromAnotherBank from "./components/ImportQuestionFromAnotherBank";
import { MUTATION_KEYS } from "../../config/constants/queryMutationKeys";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../config/constants/toasts";
import { QuestionContentItf } from "../../types/types";

const QuestionBankPage = () => {
    const params = useParams();
    const location = useLocation();
    const isImporting = location.state?.isImporting;
    const [isCreatingQuestion, setIsCreatingQuestion] =
        useState<boolean>(false);
    const [isImportingFromAnotherBank, setIsImportingFromAnotherBank] =
        useState<boolean>(isImporting);

    const {
        data: questionBank,
        isLoading: isLoadingQuestionBank,
        refetch: refetchQuestionBank,
    } = useQuery<QuestionBankItf>({
        queryKey: ["questionBank"],
        queryFn: async () => {
            if (!params.questionBankId) {
                return null;
            }
            const data = await getQuestionBank(params.questionBankId);
            return {
                ...data.questionBank,
                questions_detail: data.questionBank.questions,
                questions: data.questionBank.questions.map(
                    (question: any) => question.id
                ),
            };
        },
    });

    const { mutate: importQuestionsMutate, isLoading: importQuestionsLoading } =
        useMutation({
            mutationFn: async (
                selectedQuestions: QuestionInBankItf<QuestionContentItf>[]
            ) => {
                if (!questionBank) return;
                await importQuestionToBank(questionBank.id, {
                    questions: selectedQuestions.map(
                        (question) => question.id!
                    ),
                });
            },
            mutationKey: [MUTATION_KEYS.IMPORT_QUESTIONS_TO_BANK],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.IMPORT_QUESTIONS_SUCCESSFULLY);
                refetchQuestionBank();
                setIsImportingFromAnotherBank(false);
            },
        });

    const handleCreateQuestion = () => {
        setIsCreatingQuestion(true);
    };

    const handleImportFromAnotherBank = () => {
        setIsImportingFromAnotherBank(true);
    };

    const handleConfirmQuestions = (
        selectedQuestions: QuestionInBankItf<QuestionContentItf>[]
    ) => {
        importQuestionsMutate(selectedQuestions);
    };

    return (
        <div className="w-3/4 mx-auto mt-4">
            <Loading
                loadingText={{ text: "Loading question bank..." }}
                isLoading={isLoadingQuestionBank}
            />
            {!isLoadingQuestionBank && questionBank && (
                <div>
                    <Header questionBank={questionBank} />
                    <Questions
                        questions={questionBank.questions_detail}
                        questionBank={questionBank}
                        onAfterUpdate={() => refetchQuestionBank()}
                    />
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={handleCreateQuestion}
                            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md leading-none"
                        >
                            Create question
                        </button>
                        <button
                            onClick={handleImportFromAnotherBank}
                            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md leading-none"
                        >
                            Import from another bank
                        </button>
                    </div>
                </div>
            )}

            {questionBank && isCreatingQuestion && (
                <CreateQuestion
                    onClose={() => setIsCreatingQuestion(false)}
                    onAfterCreate={() => refetchQuestionBank()}
                    questionBank={questionBank}
                />
            )}
            {questionBank && isImportingFromAnotherBank && (
                <ImportQuestionFromAnotherBank
                    currentBank={questionBank}
                    onClose={() => setIsImportingFromAnotherBank(false)}
                    onConfirmQuestions={handleConfirmQuestions}
                />
            )}
        </div>
    );
};

export default QuestionBankPage;
