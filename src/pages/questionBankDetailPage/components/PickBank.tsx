import React from "react";
import { QuestionBankItf } from "../../../types/questionBank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

type PickBankProps = {
    banks: QuestionBankItf[];
    onSelectBank: (bank: QuestionBankItf) => void;
    selectedBank: QuestionBankItf | null;
};

const PickBank = ({ banks, onSelectBank, selectedBank }: PickBankProps) => {
    const handleClickBank = (bank: QuestionBankItf) => {
        onSelectBank(bank);
    };

    return (
        <div>
            <p>Choose a bank to import questions from:</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
                {banks.map((bank) => (
                    <div
                        onClick={() => handleClickBank(bank)}
                        key={bank.id}
                        className={`cursor-pointer relative px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm`}
                    >
                        {selectedBank && selectedBank.id === bank.id && (
                            <span>
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-orange-600 absolute top-1 right-1"
                                />
                            </span>
                        )}
                        <div className="text-lg font-bold">{bank.name}</div>
                        <div className="text-sm text-gray-500">
                            {bank.questions.length} questions
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PickBank;
