import React, { ChangeEvent, useEffect, useState } from "react";
import {
    FillGapsQuestionFormDataItf,
    MatchingQuestionFormDataItf,
    MultipleChoiceQuestionFormDataItf,
    QuestionFormDataItf,
    QuestionItf,
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
import { mulitpleChoicesQuestionSchema } from "../../../../validations/test";
import { questionTypeToQuestionSchema } from "../../../../utils/mapping";

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
    const [questionFormData, setQuestionFormData] =
        useState<QuestionFormDataItf>(
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

        setQuestionFormData({
            ...questionFormData,
            [name]: value,
            content: name === "type" ? null : questionFormData.content,
        });
    };

    const handleContentChange = (
        content:
            | MultipleChoiceQuestionFormDataItf
            | FillGapsQuestionFormDataItf
            | MatchingQuestionFormDataItf
    ) => {
        setQuestionFormData({ ...questionFormData, content: content });
    };

    useEffect(() => {
        if (question && questionFormData.type === question.type) {
            setQuestionFormData(question);
            return;
        }

        switch (questionFormData.type) {
            case questionTypes.MULITPLE_CHOICES:
                setQuestionFormData({
                    ...questionFormData,
                    content: {
                        allow_multiple: false,
                        options: [{ text: "" }, { text: "" }],
                        text: "",
                    },
                });
                break;
            case questionTypes.FILL_GAPS:
                setQuestionFormData({
                    ...questionFormData,
                    content: {
                        text: "",
                        num_gaps: 1,
                    },
                });
                break;
            case questionTypes.MATCHING:
                setQuestionFormData({
                    ...questionFormData,
                    content: {
                        text: "",
                        left_items: [{ text: "" }, { text: "" }],
                        right_items: [{ text: "" }, { text: "" }],
                    },
                });
                break;
        }
    }, [question, questionFormData.type]);

    const { mutate: createQuestionMutate, isLoading: createQuestionLoading } =
        useMutation({
            mutationFn: async (questionBody: QuestionFormDataItf) =>
                await createQuestion(testId, questionBody),
            mutationKey: ["create-question", { body: questionFormData }],
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
            mutationFn: async (questionBody: QuestionFormDataItf) =>
                await updateQuestion(testId, question!._id, questionBody),
            mutationKey: [
                "update-question",
                { questionId: question?._id, body: questionFormData },
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
            questionFormData.type
        )!;
        const { error } = questionSchema.validate(questionFormData.content);

        if (error) {
            toast.error(error.message);
            return;
        }

        if (!question) {
            createQuestionMutate(questionFormData);
        } else {
            updateQuestionMutate(questionFormData);
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
                Question {questionFormData.order}
            </div>
            {open && (
                <Modal onClose={() => setOpen(false)}>
                    <Modal.Header
                        title={`Question ${questionFormData.order}`}
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
                                        value={questionFormData.score}
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
                                        value={questionFormData.level}
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
                                        value={questionFormData.type}
                                        onChange={handleInputChange}
                                    >
                                        <option
                                            value={
                                                questionTypes.MULITPLE_CHOICES
                                            }
                                        >
                                            {questionTypes.MULITPLE_CHOICES}
                                        </option>
                                        <option value={questionTypes.FILL_GAPS}>
                                            {questionTypes.FILL_GAPS}
                                        </option>
                                        <option value={questionTypes.MATCHING}>
                                            {questionTypes.MATCHING}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="grow overflow-hidden">
                                {questionFormData.content &&
                                    questionFormData.type ===
                                        questionTypes.MULITPLE_CHOICES && (
                                        <MulitpleChoiceQuestion
                                            content={
                                                questionFormData.content as MultipleChoiceQuestionFormDataItf
                                            }
                                            onContentChange={
                                                handleContentChange
                                            }
                                        />
                                    )}
                                {questionFormData.content &&
                                    questionFormData.type ===
                                        questionTypes.FILL_GAPS && (
                                        <FillGapsQuestion
                                            content={
                                                questionFormData.content as FillGapsQuestionFormDataItf
                                            }
                                            onContentChange={
                                                handleContentChange
                                            }
                                        />
                                    )}
                                {questionFormData.content &&
                                    questionFormData.type ===
                                        questionTypes.MATCHING && (
                                        <MatchingQuestion
                                            content={
                                                questionFormData.content as MatchingQuestionFormDataItf
                                            }
                                            onContentChange={
                                                handleContentChange
                                            }
                                        />
                                    )}
                            </div>
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
