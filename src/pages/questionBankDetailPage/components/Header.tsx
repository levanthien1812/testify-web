import React from "react";
import { QuestionBankItf } from "../../../types/questionBank";
import { format } from "date-fns";
import CreateBank from "../../questionBanksPage/components/CreateBank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import { useMutation } from "react-query";
import { deleteQuestionBank } from "../../../services/questionBank";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

type HeaderProps = {
    questionBank: QuestionBankItf;
};

const Header = ({ questionBank }: HeaderProps) => {
    const [isEditting, setIsEditing] = React.useState(false);
    const [isConfirmingDeletion, setIsConfirmingDeletion] =
        React.useState(false);
    const navigate = useNavigate();

    const { mutate: deleteQuestionMutate, isLoading: isDeletingQuestion } =
        useMutation({
            mutationFn: async () => await deleteQuestionBank(questionBank.id),
            mutationKey: [MUTATION_KEYS.DELETE_QUESTION_BANK],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.DELETE_QUESTION_BANK_SUCCESSFULLY);
                setIsConfirmingDeletion(false);
                navigate("/home");
            },
        });

    const handleConfirmDelete = () => {
        deleteQuestionMutate();
    };

    return (
        <div className="flex justify-between items-start border-b-2 border-orange-600 py-2">
            <div className="max-w-[70%]">
                <div className="flex gap-2 items-center">
                    <div className="text-2xl font-bold">
                        {questionBank.name}
                    </div>
                    {questionBank.is_bookmarked && (
                        <FontAwesomeIcon
                            icon={faBookmarkSolid}
                            className="text-xl text-yellow-400"
                        />
                    )}
                </div>
                <div className="text-md text-gray-500">
                    {questionBank.description}
                </div>
                <div className="flex gap-2 mt-2">
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full leading-none shadow-sm"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full leading-none shadow-sm"
                        onClick={() => setIsConfirmingDeletion(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                {questionBank.tags && (
                    <div className="flex gap-1">
                        {questionBank.tags.map((tag) => (
                            <div
                                className="rounded-full border border-green-500 bg-green-200 text-green-600 px-2 py-0.5 text-xs font-semibold text-center"
                                key={tag}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
                {questionBank.created_at && (
                    <div>
                        Created at:{" "}
                        <span className="text-orange-500">
                            {format(
                                new Date(questionBank.created_at),
                                "dd/MM/yyyy hh:mm a"
                            )}
                        </span>
                    </div>
                )}
                {questionBank.updated_at && (
                    <div className="">
                        Updated at:{" "}
                        <span className="text-orange-500">
                            {format(
                                new Date(questionBank.updated_at),
                                "dd/MM/yyyy hh:mm a"
                            )}
                        </span>
                    </div>
                )}
                <div>
                    <span className="bg-orange-600 text-white leading-none px-4 py-0 rounded-md">
                        {questionBank.questions.length}
                    </span>{" "}
                    questions
                </div>
            </div>
            {isEditting && (
                <CreateBank
                    questionBank={questionBank}
                    onClose={() => setIsEditing(false)}
                />
            )}
            {isConfirmingDeletion && (
                <ConfirmModal
                    title="Delete Bank"
                    message="Are you sure you want to delete this bank?"
                    onConfirm={handleConfirmDelete}
                    onClose={() => setIsConfirmingDeletion(false)}
                    isConfirming={isDeletingQuestion}
                />
            )}
        </div>
    );
};

export default Header;
