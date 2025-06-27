import React, { useMemo, useState } from "react";
import Modal, {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "../../../components/modals/Modal";
import { Control, useFieldArray, useForm } from "react-hook-form";
import {
    QuestionBankBodyItf,
    QuestionBankBodyTempItf,
    QuestionBankItf,
} from "../../../types/questionBank";
import { INITIAL_QUESTION_BANK } from "../../../config/constants/initialValues";
import Input from "../../../components/elements/Input";
import { useMutation } from "react-query";
import {
    createQuestionBank,
    updateQuestionBank,
} from "../../../services/questionBank";
import { toast } from "react-toastify";
import Button from "../../../components/elements/Button";
import Checkbox from "../../../components/elements/Checkbox";
import { pickFieldsFromObject } from "../../../utils/object";

type CreateBankProps = {
    onClose: () => void;
    onAfterCreate?: () => void;
    questionBank?: QuestionBankItf;
};

const CreateBank = ({
    onClose,
    onAfterCreate,
    questionBank,
}: CreateBankProps) => {
    const defaultValue = useMemo<QuestionBankBodyTempItf>(
        () =>
            questionBank
                ? {
                      ...pickFieldsFromObject(
                          questionBank,
                          INITIAL_QUESTION_BANK
                      ),
                      tags: questionBank.tags.map((tag) => ({ name: tag })),
                  }
                : INITIAL_QUESTION_BANK,
        [questionBank]
    );

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
    } = useForm<QuestionBankBodyTempItf>({
        defaultValues: defaultValue,
    });
    const [newTag, setNewTag] = useState("");

    const {
        fields: tags,
        append,
        remove,
    } = useFieldArray<QuestionBankBodyTempItf>({
        control,
        name: "tags",
    });

    const { mutate: createBankMutate, isLoading: isCreatingBank } = useMutation(
        {
            mutationFn: async (data: QuestionBankBodyItf) => {
                const responeData = await createQuestionBank(data);
                return responeData.questionBank;
            },
            onSuccess: () => {
                toast.success("Question bank created successfully");
                if (onAfterCreate) onAfterCreate();
            },
        }
    );

    const { mutate: updateBankMutate, isLoading: isUpdatingBank } = useMutation(
        {
            mutationFn: async (data: Partial<QuestionBankBodyItf>) => {
                if (!questionBank) return;
                const responeData = await updateQuestionBank(
                    questionBank.id,
                    data
                );
                return responeData.questionBank;
            },
            onSuccess: () => {
                toast.success("Question bank updated successfully");
                if (onAfterCreate) onAfterCreate();
            },
        }
    );

    const onSubmit = (data: QuestionBankBodyTempItf) => {
        const mappedData = {
            ...data,
            tags: tags.map((tag) => tag.name),
        };
        if (questionBank) updateBankMutate(mappedData);
        else createBankMutate(mappedData);

        onClose();
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTag.length > 0) {
            e.preventDefault();
            append({ name: newTag });
            setNewTag("");
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (newTag.length > 0) {
            append({ name: newTag });
            setNewTag("");
        }
    };

    const onNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(e.target.value);
    };

    const removeTag = (index: number) => {
        remove(index);
    };

    return (
        <Modal onClose={onClose} allowClickBackdropToClose={true}>
            <ModalHeader title={questionBank ? "Edit Bank" : "Create Bank"} />
            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div>
                        <Input
                            type="text"
                            min={0}
                            {...register("name", {
                                required: "Name is required",
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Name cannot exceed 100 characters",
                                },
                                minLength: {
                                    value: 3,
                                    message:
                                        "Name must be at least 3 characters",
                                },
                            })}
                            error={errors?.name && errors?.name.message}
                            label={{ text: "Name" }}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            min={0}
                            {...register("description")}
                            error={
                                errors?.description &&
                                errors?.description.message
                            }
                            label={{ text: "Description" }}
                        />
                    </div>
                    <div>
                        <label htmlFor="new-tag">Tags:</label>

                        <div className="flex gap-1">
                            {tags.map((tag, index) => (
                                <button
                                    key={tag.id}
                                    className="border border-green-500 bg-green-50 text-green-600 rounded-full px-4 py-1 leading-none"
                                    onClick={() => removeTag(index)}
                                >
                                    {tag.name}
                                </button>
                            ))}
                            <input
                                id="new-tag"
                                type="text"
                                placeholder="Enter tag"
                                onKeyDown={handlePressEnter}
                                onBlur={handleBlur}
                                className="bg-white text-green-600 border border-green-600 rounded-full px-4 py-1 leading-none outline-none w-fit max-w-[100px]"
                                onChange={onNewTagChange}
                                value={newTag}
                            />
                        </div>

                        <p className="italic text-gray-500 text-sm text-end mt-1">
                            Tap tag to remove!
                        </p>
                    </div>

                    <div>
                        <Checkbox
                            label={{ text: "Bookmark this question bank" }}
                            {...register("is_bookmarked")}
                            defaultChecked={questionBank?.is_bookmarked}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={onClose} secondary>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreatingBank || isUpdatingBank}
                        >
                            {isCreatingBank || isUpdatingBank
                                ? "Creating..."
                                : "Create"}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default CreateBank;
