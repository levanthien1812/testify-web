import React from "react";
import {
    MultipleChoiceQuestionBodyItf,
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
import { useAppSelector } from "../../../../hooks/hooks";
import Input from "../../../../components/elements/Input";

const MulitpleChoiceQuestion: React.FC<{
    content: MultipleChoiceQuestionBodyItf;
    control: Control<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>;
    errors: FieldErrors<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>;
}> = ({ content, control, errors }) => {
    const {
        fields: options,
        append: appendOption,
        remove: removeOption,
    } = useFieldArray<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>({
        control,
        name: "content.options",
    });

    const { register } = control;

    const { editibility } = useAppSelector((state) => state.createTest);

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
                    disabled={!editibility.TEST_QUESTIONS.content}
                />
                {errors.content?.text && (
                    <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                        {errors.content.text.message}
                    </p>
                )}
            </div>
            <div className="mt-2">
                <p>Options</p>
                <div className="space-y-1">
                    {options.map((option, index) => (
                        <Option
                            index={index}
                            key={index}
                            onDelete={() => removeOption(index)}
                            {...register(`content.options.${index}.text`, {
                                required: "Option is required",
                            })}
                            defaultValue={option.text}
                            error={
                                errors.content?.options?.[index]?.text?.message
                            }
                            disabled={!editibility.TEST_QUESTIONS.content}
                        />
                    ))}

                    <Button
                        secondary
                        type="button"
                        className="w-full"
                        onClick={() => appendOption({ text: "" })}
                        disabled={
                            content?.options?.length >= 10 &&
                            !editibility.TEST_QUESTIONS.content
                        }
                    >
                        Add option
                    </Button>
                </div>
            </div>
        </>
    );
};

export default MulitpleChoiceQuestion;
