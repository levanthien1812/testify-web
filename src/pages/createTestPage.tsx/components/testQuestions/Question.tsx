import { ChangeEvent, useEffect, useState } from "react";
import {
    FillGapsQuestionBodyItf,
    MatchingQuestionBodyItf,
    MultipleChoiceQuestionBodyItf,
    QuestionBodyItf,
    QuestionItf,
    ResponseQuestionBodyItf,
    TestPartItf,
} from "../../../../types/types";
import Modal from "../../../../components/modals/Modal";
import { questionTypes, testLevels } from "../../../../config/config";
import MulitpleChoiceQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";
import { useMutation } from "react-query";
import { createQuestion, updateQuestion } from "../../../../services/test";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { questionTypeToQuestionSchema } from "../../../../utils/mapping";
import ResponseQuestion from "./ResponseQuestion";

type QuestionProps = {
    question: QuestionItf | null;
    part?: TestPartItf;
    index: number;
    testId: string;
    onAfterUpdate: () => void;
};

const Question = ({
    question,
    onAfterUpdate,
    testId,
    part,
    index,
}: QuestionProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [questionBody, setQuestionBody] = useState<QuestionBodyItf>(
        part
            ? {
                  score: 1,
                  level: testLevels.NONE,
                  type: question
                      ? question.type
                      : questionTypes.MULITPLE_CHOICES,
                  content: null,
                  order: index + 1,
                  part_id: part._id,
              }
            : {
                  score: 1,
                  level: testLevels.NONE,
                  type: question
                      ? question.type
                      : questionTypes.MULITPLE_CHOICES,
                  content: null,
                  order: index + 1,
              }
    );

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let name: string, value: string | number | Date;
        name = e.target.name;
        value = e.target.value;

        if (["score"].includes(name)) {
            value = parseInt(value);
        }

        setQuestionBody({
            ...questionBody,
            [name]: value,
            content: name === "type" ? null : questionBody.content,
        });
    };

    const handleContentChange = (
        content:
            | MultipleChoiceQuestionBodyItf
            | FillGapsQuestionBodyItf
            | MatchingQuestionBodyItf
            | ResponseQuestionBodyItf
    ) => {
        setQuestionBody({ ...questionBody, content: content });
    };

    useEffect(() => {
        if (question && questionBody.type === question.type) {
            setQuestionBody(question);
            return;
        }

        switch (questionBody.type) {
            case questionTypes.MULITPLE_CHOICES:
                setQuestionBody({
                    ...questionBody,
                    content: {
                        allow_multiple: false,
                        options: [{ text: "" }, { text: "" }],
                        text: "",
                    },
                });
                break;
            case questionTypes.FILL_GAPS:
                setQuestionBody({
                    ...questionBody,
                    content: {
                        text: "",
                        num_gaps: 1,
                    },
                });
                break;
            case questionTypes.MATCHING:
                setQuestionBody({
                    ...questionBody,
                    content: {
                        text: "",
                        left_items: [{ text: "" }, { text: "" }],
                        right_items: [{ text: "" }, { text: "" }],
                    },
                });
                break;
            case questionTypes.RESPONSE:
                setQuestionBody({
                    ...questionBody,
                    content: {
                        text: "",
                        minLength: 1,
                        maxLength: 1,
                    },
                });
                break;
        }
    }, [question, questionBody.type]);

    const { mutate: createQuestionMutate, isLoading: createQuestionLoading } =
        useMutation({
            mutationFn: async (questionBody: QuestionBodyItf) =>
                await createQuestion(testId, questionBody),
            mutationKey: ["create-question", { body: questionBody }],
            onSuccess: (data) => {
                toast.success("Create question successfuly");
                setOpen(false);
                onAfterUpdate();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const { mutate: updateQuestionMutate, isLoading: updateQuestionLoading } =
        useMutation({
            mutationFn: async (questionBody: QuestionBodyItf) =>
                await updateQuestion(testId, question!._id, questionBody),
            mutationKey: [
                "update-question",
                { questionId: question?._id, body: questionBody },
            ],
            onSuccess: (data) => {
                toast.success("Update question successfuly");
                setOpen(false);
                onAfterUpdate();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const handleSaveQuestion = () => {
        const questionSchema = questionTypeToQuestionSchema.get(
            questionBody.type
        )!;

        const { error } = questionSchema.validate(questionBody.content);

        if (error) {
            toast.error(error.message);
            return;
        }

        if (!question) {
            createQuestionMutate(questionBody);
        } else {
            updateQuestionMutate(questionBody);
        }
    };

    return (
        <>
            <div
                className={`bg-orange-100 p-2 text-center cursor-pointer hover:bg-orange-200 ${
                    question && "border border-orange-500"
                }`}
                onClick={() => setOpen(true)}
            >
                Question {questionBody.order}
            </div>
            {open && (
                <Modal onClose={() => setOpen(false)}>
                    <Modal.Header
                        title={`Question ${questionBody.order}`}
                        onClose={() => setOpen(false)}
                    />
                    <Modal.Body>
                        <div className="w-[600px] flex gap-4">
                            <div className="space-y-4 gap-4 w-1/3 shrink-0">
                                <div className="flex items-end gap-2">
                                    <label htmlFor="score" className="w-1/5">
                                        Score:{" "}
                                    </label>
                                    <input
                                        type="number"
                                        name="score"
                                        id="score"
                                        min={0}
                                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow leading-5"
                                        value={questionBody.score}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <label htmlFor="level" className="w-1/5">
                                        Level:{" "}
                                    </label>
                                    <select
                                        id="level"
                                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow capitalize"
                                        name="level"
                                        value={questionBody.level}
                                        onChange={handleInputChange}
                                    >
                                        {Object.values(testLevels).map(
                                            (level) => (
                                                <option
                                                    value={level}
                                                    key={level}
                                                >
                                                    {level}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <label htmlFor="type" className="w-1/5">
                                        Type:{" "}
                                    </label>
                                    <select
                                        id="type"
                                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow capitalize"
                                        name="type"
                                        value={questionBody.type}
                                        onChange={handleInputChange}
                                    >
                                        {Object.values(questionTypes).map(
                                            (questionType) => (
                                                <option
                                                    value={questionType}
                                                    key={questionType}
                                                >
                                                    {questionType}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                            {questionBody.content && (
                                <div className="grow overflow-hidden">
                                    {questionBody.type ===
                                        questionTypes.MULITPLE_CHOICES && (
                                        <MulitpleChoiceQuestion
                                            content={
                                                questionBody.content as MultipleChoiceQuestionBodyItf
                                            }
                                            onContentChange={
                                                handleContentChange
                                            }
                                        />
                                    )}
                                    {questionBody.type ===
                                        questionTypes.FILL_GAPS && (
                                        <FillGapsQuestion
                                            content={
                                                questionBody.content as FillGapsQuestionBodyItf
                                            }
                                            onContentChange={
                                                handleContentChange
                                            }
                                        />
                                    )}
                                    {questionBody.type ===
                                        questionTypes.MATCHING && (
                                        <MatchingQuestion
                                            content={
                                                questionBody.content as MatchingQuestionBodyItf
                                            }
                                            onContentChange={
                                                handleContentChange
                                            }
                                        />
                                    )}
                                    {questionBody.type ===
                                        questionTypes.RESPONSE && (
                                        <ResponseQuestion
                                            content={
                                                questionBody.content as ResponseQuestionBodyItf
                                            }
                                            onContentChange={
                                                handleContentChange
                                            }
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-end gap-3">
                            <button
                                className="text-white px-9 py-0.5 bg-gray-500"
                                type="button"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="text-white bg-orange-600 px-9 py-0.5 hover:bg-orange-700"
                                type="submit"
                                disabled={
                                    createQuestionLoading ||
                                    updateQuestionLoading
                                }
                                onClick={handleSaveQuestion}
                            >
                                {!(
                                    createQuestionLoading ||
                                    updateQuestionLoading
                                )
                                    ? "Save"
                                    : "Saving..."}
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default Question;
