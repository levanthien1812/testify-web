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
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import { questionTypes, testLevels } from "../../../../config/config";
import MulitpleChoiceQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";
import { useMutation } from "react-query";
import { saveQuestion } from "../../../../services/test";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { questionTypeToQuestionSchema } from "../../../../utils/mapping";
import ResponseQuestion from "./ResponseQuestion";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import Select from "../../../../components/elements/Select";

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
            value = parseFloat(value);
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
                await saveQuestion(testId, questionBody),
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
                await saveQuestion(testId, questionBody, question!._id),
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
                    <ModalHeader title={`Question ${questionBody.order}`} />
                    <ModalBody>
                        <div className="w-[600px] flex gap-4">
                            <div className="space-y-4 gap-4 w-1/3 shrink-0">
                                <div className="flex items-end gap-2">
                                    <label htmlFor="score" className="w-1/5">
                                        Score:{" "}
                                    </label>
                                    <Input
                                        type="number"
                                        name="score"
                                        id="score"
                                        min={0}
                                        className="w-0 grow"
                                        value={questionBody.score}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <label htmlFor="level" className="w-1/5">
                                        Level:{" "}
                                    </label>
                                    <Select
                                        id="level"
                                        className="grow capitalize"
                                        name="level"
                                        value={questionBody.level}
                                        onChange={handleInputChange}
                                        options={Object.values(testLevels).map(
                                            (level) => ({
                                                label: level,
                                                value: level,
                                            })
                                        )}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <label htmlFor="type" className="w-1/5">
                                        Type:{" "}
                                    </label>
                                    <Select
                                        id="type"
                                        className="grow capitalize"
                                        name="type"
                                        value={questionBody.type}
                                        onChange={handleInputChange}
                                        options={Object.values(
                                            questionTypes
                                        ).map((type) => ({
                                            label: type,
                                            value: type,
                                        }))}
                                    />
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
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            disabled={
                                createQuestionLoading || updateQuestionLoading
                            }
                            onClick={handleSaveQuestion}
                        >
                            {!(createQuestionLoading || updateQuestionLoading)
                                ? "Save"
                                : "Saving..."}
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </>
    );
};

export default Question;
