import React from "react";
import {
    QuestionBodyItf,
    ResponseQuestionBodyItf,
} from "../../../../types/types";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import Input from "../../../../components/elements/Input";
import { Control, Controller, FieldErrors } from "react-hook-form";

const ResponseQuestion: React.FC<{
    content: ResponseQuestionBodyItf;
    control: Control<QuestionBodyItf<ResponseQuestionBodyItf>>;
    errors: FieldErrors<QuestionBodyItf<ResponseQuestionBodyItf>>;
}> = ({ content, control, errors }) => {
    const { register } = control;
    return (
        <>
            <div className="flex flex-col mt-2">
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
            <div className="flex flex-col items-start mt-2">
                <Input
                    type="number"
                    min={1}
                    {...register("content.min_length", {
                        required: "Minimum length is required",
                        min: {
                            value: 1,
                            message: "Minimum length must be at least 1",
                        },
                    })}
                    error={
                        errors.content?.min_length &&
                        errors.content.min_length.message
                    }
                    label={{ text: "Minimum length of response" }}
                    required
                />
            </div>
            <div className="flex flex-col items-start mt-2">
                <Input
                    type="number"
                    min={1}
                    {...register("content.max_length", {
                        required: "Maximum length is required",
                        min: {
                            value: 1,
                            message: "Maximum length must be at least 1",
                        },
                    })}
                    error={
                        errors.content?.max_length &&
                        errors.content.max_length.message
                    }
                    label={{ text: "Maximum length of response" }}
                    required
                />
            </div>
        </>
    );
};

export default ResponseQuestion;
