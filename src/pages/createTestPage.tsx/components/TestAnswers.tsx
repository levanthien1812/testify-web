import { useMemo } from "react";
import { TestItf } from "../../../types/types";
import Answer from "./testAnswers/Answer";
import Questions from "./testQuestions/Questions";
import { testStatus } from "../../../config/config";
import Button from "../../../components/elements/Button";

type SectionProps = {
    test: TestItf;
    onAfterUpdate: () => void;
    onBack: () => void;
    onNext: () => void;
};

const TestAnswers = ({ test, onBack, onNext, onAfterUpdate }: SectionProps) => {
    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        onNext();
    };

    const isProvideInAdvance = useMemo(() => {
        return (
            test.status === testStatus.DRAFT ||
            test.status === testStatus.PUBLISHABLE
        );
    }, [test.status]);

    return (
        <div
            className={
                isProvideInAdvance ? "px-20 py-12 shadow-2xl" : "px-8 py-4"
            }
        >
            {isProvideInAdvance && (
                <>
                    <h2 className="text-center text-3xl">Test Answers</h2>
                    <p className="text-center">
                        You can skip this section and provide answers later
                    </p>
                </>
            )}

            <div className={`space-y-3 ${isProvideInAdvance && "mt-4"}`}>
                {test.parts.length > 0 &&
                    test.parts.map((part) => (
                        <Questions
                            part={part}
                            key={part.name}
                            questions={part.questions!}
                            onAfterUpdate={onAfterUpdate}
                            withAnswer={true}
                        />
                    ))}
                {test.parts.length === 0 && (
                    <div className={`px-4 py-4 space-y-2`}>
                        {test.questions!.map((question) => (
                            <Answer
                                question={question}
                                key={question._id}
                                onAfterUpdate={onAfterUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isProvideInAdvance && (
                <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                    <Button size="lg" onClick={handleBack}>
                        Back
                    </Button>
                    <Button size="lg" onClick={handleNext}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TestAnswers;
