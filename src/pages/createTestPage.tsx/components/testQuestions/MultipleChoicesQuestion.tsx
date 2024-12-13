import React from "react";
import {
    MultipleChoiceQuestionBodyItf,
    QuestionBodyItf,
} from "../../../../types/types";
import Option from "./Option";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import Button from "../../../../components/elements/Button";
import ImagesChoser from "../../../../components/elements/ImagesChoser";
import {
    Control,
    Controller,
    FieldErrors,
    useFieldArray,
    UseFormRegister,
} from "react-hook-form";

const MulitpleChoiceQuestion: React.FC<{
    content: MultipleChoiceQuestionBodyItf;
    control: Control<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>;
    errors: FieldErrors<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>;
    register: UseFormRegister<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>;
}> = ({ content, control, register, errors }) => {
    const {
        fields: options,
        append: appendOption,
        remove: removeOption,
    } = useFieldArray<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>({
        control,
        name: "content.options",
    });

    return (
        <>
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
                        />
                    ))}

                    <Button
                        primary={false}
                        type="button"
                        className="w-full"
                        onClick={() => appendOption({ text: "" })}
                        disabled={content.options.length >= 10}
                    >
                        Add option
                    </Button>
                </div>

                <div className="mt-4">
                    <label htmlFor="images">Images</label>
                    <ImagesChoser
                        images={content.images || null}
                        {...register("content.images", {})}
                    />
                </div>
            </div>
        </>
    );
};

export default MulitpleChoiceQuestion;
