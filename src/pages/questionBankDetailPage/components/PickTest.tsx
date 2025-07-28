import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { TestToImportQuestion } from "../../../types/types";
import { shorten } from "../../../utils/text";

type PickTestProps = {
    tests: TestToImportQuestion[];
    onSelectTest: (test: TestToImportQuestion) => void;
    selectedTest: TestToImportQuestion | null;
};

const PickTest = ({ tests, onSelectTest, selectedTest }: PickTestProps) => {
    const handleClickTest = (test: TestToImportQuestion) => {
        onSelectTest(test);
    };

    return (
        <div>
            <p>Choose a test to import questions from:</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
                {tests.map((test) => (
                    <div
                        onClick={() => handleClickTest(test)}
                        key={test.id}
                        className={`cursor-pointer relative px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 shadow-sm`}
                    >
                        {selectedTest && selectedTest.id === test.id && (
                            <span>
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-orange-600 absolute top-1 right-1"
                                />
                            </span>
                        )}
                        <div className="text-lg font-bold">
                            {shorten(test.title, 40)}
                        </div>
                        <div className="text-sm text-gray-500">
                            {test.questions!.length} questions
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PickTest;
