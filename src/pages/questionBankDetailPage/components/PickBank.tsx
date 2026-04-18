import React from "react";
import { QuestionBankItf } from "../../../types/questionBank";
import CardPicker from "../../../components/pickers/CardPicker";

type PickBankProps = {
    banks: QuestionBankItf[];
    onSelectBank: (bank: QuestionBankItf) => void;
    selectedBank: QuestionBankItf | null;
};

const PickBank = ({ banks, onSelectBank, selectedBank }: PickBankProps) => {
    const selectedBankIds = selectedBank ? [selectedBank.id] : [];

    const handleSelectionChange = (
        _ids: string[],
        selectedItems: QuestionBankItf[],
    ) => {
        if (selectedItems.length === 0) {
            return;
        }
        onSelectBank(selectedItems[0]);
    };

    return (
        <div>
            <p>Choose a bank to import questions from:</p>
            <div className="mt-4">
                <CardPicker
                    items={banks}
                    selectedIds={selectedBankIds}
                    onSelectionChange={handleSelectionChange}
                    getItemId={(bank) => bank.id}
                    renderCard={(bank) => (
                        <div className="px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm transition">
                            <div className="text-lg font-bold">{bank.name}</div>
                            <div className="text-sm text-gray-500">
                                {bank.questions.length} questions
                            </div>
                        </div>
                    )}
                    multiSelect={false}
                    gridCols={3}
                    showSelectAllButton={false}
                    emptyMessage="No banks available"
                />
            </div>
        </div>
    );
};

export default PickBank;
