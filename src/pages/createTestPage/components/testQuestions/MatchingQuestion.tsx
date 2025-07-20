import React from "react";
import {
    MatchingQuestionBodyItf,
    QuestionBodyItf,
} from "../../../../types/types";
import Option from "./Option";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import Button from "../../../../components/elements/Button";
import {
    Control,
    Controller,
    FieldErrors,
    useFieldArray,
} from "react-hook-form";
import Input from "../../../../components/elements/Input";

const MatchingQuestion: React.FC<{
    content: MatchingQuestionBodyItf;
    control: Control<QuestionBodyItf<MatchingQuestionBodyItf>>;
    errors: FieldErrors<QuestionBodyItf<MatchingQuestionBodyItf>>;
}> = ({ content, control, errors }) => {
    const { register } = control;
    const {
        fields: leftItems,
        append: appendLeftItem,
        remove: removeLeftItem,
    } = useFieldArray<QuestionBodyItf<MatchingQuestionBodyItf>>({
        control,
        name: "content.left_items",
    });
    const {
        fields: rightItems,
        append: appendRightItem,
        remove: removeRightItem,
    } = useFieldArray<QuestionBodyItf<MatchingQuestionBodyItf>>({
        control,
        name: "content.right_items",
    });

    const handleAddOption = () => {
        appendLeftItem({ text: "" });
        appendRightItem({ text: "" });
    };

    return (
        <>
            <div className="flex flex-col">
                <Input
                    type="text"
                    min={0}
                    {...register("content.instruction_text")}
                    error={
                        errors.content?.instruction_text &&
                        errors.content.instruction_text.message
                    }
                    label={{ text: "Instruction text" }}
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="text">Text: </label>
                <Controller
                    name="content.text"
                    control={control}
                    rules={{
                        required: "Text is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextEditor content={value} setContent={onChange} />
                    )}
                />
                {errors.content?.text && (
                    <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                        {errors?.content?.text?.message}
                    </p>
                )}
            </div>
            <div className="mt-2">
                <p>Left part:</p>
                <div className="space-y-1">
                    {leftItems.map((item, index) => (
                        <Option
                            index={index}
                            key={index}
                            onDelete={() => removeLeftItem(index)}
                            {...register(`content.left_items.${index}.text`, {
                                required: "Item text is required",
                            })}
                            defaultValue={item.text}
                            error={
                                errors.content?.left_items?.[index]?.text
                                    ?.message
                            }
                        />
                    ))}

                    <Button
                        secondary
                        type="button"
                        className="w-full"
                        onClick={handleAddOption}
                        disabled={content?.left_items?.length >= 10}
                    >
                        Add item
                    </Button>
                </div>
            </div>
            <div className="mt-2">
                <p>Right part:</p>
                <div className="space-y-1">
                    {rightItems?.map((item, index) => (
                        <Option
                            index={index}
                            key={index}
                            onDelete={() => removeRightItem(index)}
                            {...register(`content.right_items.${index}.text`, {
                                required: "Item text is required",
                            })}
                            defaultValue={item.text}
                            error={
                                errors.content?.right_items?.[index]?.text
                                    ?.message
                            }
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MatchingQuestion;
