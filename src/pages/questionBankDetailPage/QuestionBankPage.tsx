import React, { useState } from "react";
import Header from "./components/Header";
import { getQuestionBank } from "../../services/questionBank";
import { useParams } from "react-router";
import { QuestionBankItf } from "../../types/questionBank";
import { useQuery } from "react-query";
import Loading from "../../components/loadings/Loading";
import Questions from "./components/Questions";
import CreateQuestion from "./components/CreateQuestion";
import ImportQuestionFromAnotherBank from "./components/ImportQuestionFromAnotherBank";

const QuestionBankPage = () => {
    const params = useParams();
    const [isCreatingQuestion, setIsCreatingQuestion] =
        useState<boolean>(false);
    const [isImportingFromAnotherBank, setIsImportingFromAnotherBank] =
        useState<boolean>(false);

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

    const handleCreateQuestion = () => {
        setIsCreatingQuestion(true);
    };

    const handleImportFromAnotherBank = () => {
        setIsImportingFromAnotherBank(true);
    };

    return (
        <div className="w-3/4 mx-auto mt-4">
            {isLoadingQuestionBank && (
                <Loading
                    loadingText={{ text: "Loading question bank..." }}
                    isLoading={isLoadingQuestionBank}
                />
            )}
            {!isLoadingQuestionBank && questionBank && (
                <div>
                    <Header questionBank={questionBank} />
                    <Questions questions={questionBank.questions_detail} />
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
                    onAfterImport={() => refetchQuestionBank()}
                />
            )}
        </div>
    );
};

export default QuestionBankPage;
