import React from "react";
import {
    QuestionBankBodyItf,
    QuestionBankItf,
} from "../../../types/questionBank";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faBookmark as faBookmarkSolid,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router";
import CreateBank from "../../questionBanksPage/components/CreateBank";
import { useMutation } from "react-query";
import { updateQuestionBank } from "../../../services/questionBank";
import { toast } from "react-toastify";

type QuestionBankCardProps = {
    questionBank: QuestionBankItf;
    onAfterUpdate?: () => void;
};

const QuestionBankCard = ({
    questionBank,
    onAfterUpdate,
}: QuestionBankCardProps) => {
    const [isEditting, setIsEditing] = React.useState(false);
    const navigate = useNavigate();

    const gradientSet = [
        "bg-gradient-to-br from-fuchsia-50 to-slate-50",
        "bg-gradient-to-br from-sky-50 to-slate-50",
        "bg-gradient-to-br from-rose-50 to-slate-50",
        "bg-gradient-to-br from-green-50 to-slate-50",
    ];

    const randomGradient =
        gradientSet[Math.floor(Math.random() * gradientSet.length)];

    const { mutate: updateBankMutate, isLoading: isUpdatingBank } = useMutation(
        {
            mutationFn: async (data: Partial<QuestionBankBodyItf>) => {
                if (!questionBank) return;
                const responeData = await updateQuestionBank(
                    questionBank.id,
                    data
                );
                return responeData.questionBank;
            },
            onSuccess: () => {
                if (onAfterUpdate) onAfterUpdate();
            },
        }
    );

    const handleClickBookMark = () => {
        updateBankMutate({
            is_bookmarked: !questionBank.is_bookmarked,
        });
    };

    const handleClickView = () => {
        navigate(`/question-banks/${questionBank.id}`);
    };

    const handleClickEdit = () => {
        setIsEditing(true);
    };

    const handleClickImport = () => {
        navigate(`/question-banks/${questionBank.id}`, {
            state: {
                isImporting: true,
            },
        });
    };

    return (
        <div
            className={`border border-gray-300 rounded-xl p-4 ${randomGradient} h-full flex flex-col min-w-[300px]`}
        >
            <div className="flex items-center">
                <div className="flex gap-1">
                    {questionBank.tags &&
                        questionBank.tags.map((tag) => (
                            <div
                                className="rounded-full border border-green-500 bg-green-200 text-green-600 px-2 py-0.5 text-xs font-semibold text-center"
                                key={tag}
                            >
                                {tag}
                            </div>
                        ))}
                </div>
                <button
                    className="ml-auto bg-transparent leading-none"
                    onClick={handleClickBookMark}
                >
                    {questionBank.is_bookmarked ? (
                        <FontAwesomeIcon
                            icon={faBookmarkSolid}
                            className="text-xl text-yellow-400"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faBookmarkRegular}
                            className="text-xl"
                        />
                    )}
                </button>
            </div>
            <div className="mb-1">
                <div className="text-[24px] mt-2">{questionBank.name}</div>
                {questionBank.description && (
                    <div className="text-[16px] text-gray-500">
                        {questionBank.description}
                    </div>
                )}

                <div className="mt-2 bg-orange-50 border border-orange-500 rounded-md px-4 py-1 leading-none text-orange-500 w-fit">
                    <FontAwesomeIcon
                        icon={faQuestion}
                        className="mr-1 text-orange-500"
                    />
                    {questionBank.questions.length} questions
                </div>
                {!questionBank.updated_at && questionBank.created_at && (
                    <div>
                        Created at:{" "}
                        <span>
                            {format(
                                new Date(questionBank.created_at),
                                "dd/MM/yyyy hh:mm a"
                            )}
                        </span>
                    </div>
                )}
                {questionBank.updated_at && (
                    <div className="mt-1">
                        Updated at:{" "}
                        <span>
                            {format(
                                new Date(questionBank.updated_at),
                                "dd/MM/yyyy hh:mm a"
                            )}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex gap-1 justify-end pt-2 border-t border-dashed border-gray-300 mt-auto">
                <button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full leading-none shadow-sm"
                    onClick={handleClickView}
                >
                    View
                </button>
                <button
                    className="bg-orange-50 border border-orange-500 hover:bg-orange-100 text-orange-500 px-3 py-1 rounded-full leading-none shadow-sm"
                    onClick={handleClickEdit}
                >
                    Edit
                </button>
                <button
                    className="bg-orange-50 border border-orange-500 hover:bg-orange-100 text-orange-500 px-3 py-1 rounded-full leading-none shadow-sm"
                    onClick={handleClickImport}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-1 text-sm" />
                    Import
                </button>
            </div>

            {isEditting && (
                <CreateBank
                    questionBank={questionBank}
                    onClose={() => {
                        setIsEditing(false);
                    }}
                    onAfterCreate={onAfterUpdate}
                />
            )}
        </div>
    );
};

export default QuestionBankCard;
