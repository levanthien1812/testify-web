import { QuestionContentItf } from "../../../types/types";
import {
    QuestionBankItf,
    QuestionInBankItf,
} from "../../../types/questionBank";
import NoResult from "../../../components/notFound/NoResult";
import ToolBar from "./ToolBar";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { questionTypeToIcon } from "../../../utils/mapping";
import CreateQuestion from "./CreateQuestion";

type QuestionsProps = {
    questions: QuestionInBankItf<QuestionContentItf>[];
    questionBank: QuestionBankItf;
    onAfterUpdate: () => void;
};

const Questions = ({
    questions,
    questionBank,
    onAfterUpdate,
}: QuestionsProps) => {
    const [layout, setLayout] = useState<"grid" | "row">("grid");
    const [questionsPerRow, setQuestionsPerRow] = useState<number>(4);
    const [selectedQuestion, setSelectedQuestion] =
        useState<QuestionInBankItf<QuestionContentItf> | null>(null);

    const layoutClass = useMemo(() => {
        if (layout === "row") return "flex flex-col gap-2";
        return `grid grid-cols-${questionsPerRow} gap-2`;
    }, [layout, questionsPerRow]);

    return (
        <div>
            {questions.length === 0 && (
                <NoResult message={{ text: "No questions found" }} />
            )}
            {questions.length > 0 && (
                <div>
                    <ToolBar
                        onSelectLayout={(layout) => {
                            setLayout(layout);
                        }}
                        currentLayout={layout}
                        onQuestionsPerRowChange={(questionsPerRow) => {
                            setQuestionsPerRow(questionsPerRow);
                        }}
                        questionsPerRow={questionsPerRow}
                    />
                </div>
            )}
            <div className={layoutClass}>
                {questions.map((question, index) => (
                    <div
                        key={question.id}
                        className="bg-white rounded-md shadow-md hover:shadow-orange-200 overflow-hidden hover:cursor-pointer"
                        onClick={() => setSelectedQuestion(question)}
                    >
                        <div className="bg-orange-50 px-2 py-1 flex">
                            <p>Question {index + 1}</p>
                            <span className="bg-orange-200 rounded-md p-1 leading-none ml-auto">
                                <FontAwesomeIcon
                                    icon={questionTypeToIcon[question.type]}
                                    className="text-gray-700"
                                />
                            </span>
                        </div>
                        <div
                            className="p-2"
                            dangerouslySetInnerHTML={{
                                __html: question.content!.text,
                            }}
                        ></div>
                    </div>
                ))}
            </div>

            {selectedQuestion && (
                <CreateQuestion
                    question={selectedQuestion}
                    questionBank={questionBank}
                    onAfterCreate={onAfterUpdate}
                    onClose={() => setSelectedQuestion(null)}
                />
            )}
        </div>
    );
};

export default Questions;
