import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { TestToImportQuestion } from "../../../types/types";
import CardPicker from "../../../components/pickers/CardPicker";
import { shorten } from "../../../utils/text";

type PickTestProps = {
    tests: TestToImportQuestion[];
    onSelectTest: (test: TestToImportQuestion) => void;
    selectedTest: TestToImportQuestion | null;
};

const PickTest = ({ tests, onSelectTest, selectedTest }: PickTestProps) => {
    const selectedTestIds = selectedTest ? [selectedTest.id] : [];

    const handleSelectionChange = (
        _ids: string[],
        selectedItems: TestToImportQuestion[],
    ) => {
        if (selectedItems.length === 0) {
            return;
        }
        onSelectTest(selectedItems[0]);
    };

    return (
        <div>
            <p>Choose a test to import questions from:</p>
            <div className="mt-4">
                <CardPicker
                    items={tests}
                    selectedIds={selectedTestIds}
                    onSelectionChange={handleSelectionChange}
                    getItemId={(test) => test.id}
                    renderCard={(test) => (
                        <div className="px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm transition h-full">
                            <div className="text-lg font-bold">
                                {shorten(test.title, 40)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {test.questions!.length} questions
                            </div>
                        </div>
                    )}
                    multiSelect={false}
                    emptyMessage="No tests available"
                />
            </div>
        </div>
    );
};

export default PickTest;
