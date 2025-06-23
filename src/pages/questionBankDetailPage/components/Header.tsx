import React from "react";
import { QuestionBankItf } from "../../../types/questionBank";
import { format } from "date-fns";

type HeaderProps = {
    questionBank: QuestionBankItf;
};

const Header = ({ questionBank }: HeaderProps) => {
    const handleClickEdit = () => {};
    return (
        <div className="flex justify-between items-start border-b-2 border-orange-600 py-2">
            <div className="max-w-[70%]">
                <div className="text-2xl font-bold">{questionBank.name}</div>
                <div className="text-md text-gray-500">
                    {questionBank.description}
                </div>
                <button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full leading-none shadow-sm"
                    onClick={handleClickEdit}
                >
                    Edit
                </button>
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
                        <span className="bg-orange-50 border border-orange-500 rounded-md px-4 leading-none text-orange-500">
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
                        <span className="bg-orange-50 border border-orange-500 rounded-md px-4 leading-none text-orange-500">
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
        </div>
    );
};

export default Header;
