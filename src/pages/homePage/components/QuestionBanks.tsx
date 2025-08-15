import SectionWrapper from "./SectionWrapper";
import { useAppSelector } from "../../../hooks/hooks";
import { ROLES } from "../../../config/constants/tests";
import { useQuery } from "react-query";
import { getQuestionBanks } from "../../../services/questionBank";
import Loading from "../../../components/loadings/Loading";
import QuestionBankCard from "./QuestionBankCard";
import { QuestionBankItf } from "../../../types/questionBank";
import { useState } from "react";
import CreateBank from "../../questionBanksPage/components/CreateBank";
import NoResult from "../../../components/notFound/NoResult";

const QuestionBanks = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [isCreatingQuestionBank, setIsCreatingQuestionBank] = useState(false);

    const {
        data: questionBanks,
        isLoading: isLoadingQuestionBanks,
        refetch: refetchQuestionBanks,
    } = useQuery<QuestionBankItf[]>({
        queryKey: ["questionBanks"],
        queryFn: async () => {
            const data = await getQuestionBanks();
            return data.questionBanks;
        },
    });

    const handleClickCreateBtn = () => {
        setIsCreatingQuestionBank(true);
    };

    return (
        <SectionWrapper
            title={{
                text: "Question Banks",
                moreInfo: (
                    <p>
                        Question Bank is a powerful tool designed to help you{" "}
                        <strong>create</strong>, <strong>manage</strong>, and{" "}
                        <strong>reuse questions</strong> for tests, quizzes, and
                        assessments. By using the Question Bank, you can build a
                        comprehensive repository of questions that can be easily
                        organized, edited, and accessed whenever you need them.
                    </p>
                ),
            }}
            buttons={[
                {
                    text: "Create a question bank",
                    onClick: handleClickCreateBtn,
                    display: user!.role === ROLES.MAKER,
                },
            ]}
            links={[
                {
                    text: "View all",
                    to: "/question-banks",
                    display:
                        !isLoadingQuestionBanks &&
                        questionBanks &&
                        questionBanks.length > 0,
                },
            ]}
        >
            <Loading
                isLoading={isLoadingQuestionBanks}
                loadingText={{ text: "Loading question banks..." }}
            />
            {questionBanks && (
                <div className="flex gap-4 mt-3 pb-1 custom-scrollbar-x">
                    {questionBanks.map((bank) => {
                        return (
                            <QuestionBankCard
                                questionBank={bank}
                                onAfterUpdate={() => {
                                    refetchQuestionBanks();
                                }}
                                key={bank.id}
                            />
                        );
                    })}

                    {questionBanks.length === 0 && (
                        <NoResult
                            message={{ text: "No question banks found." }}
                        />
                    )}
                </div>
            )}

            {isCreatingQuestionBank && (
                <CreateBank
                    onClose={() => setIsCreatingQuestionBank(false)}
                    onAfterCreate={() => {
                        refetchQuestionBanks();
                    }}
                />
            )}
        </SectionWrapper>
    );
};

export default QuestionBanks;
