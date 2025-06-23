import React from "react";
import {
    FillGapsQuestionBodyItf,
    QuestionBodyItf,
} from "../../../../types/types";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import Input from "../../../../components/elements/Input";
import { Control, Controller, FieldErrors } from "react-hook-form";

const FillGapsQuestion: React.FC<{
    content: FillGapsQuestionBodyItf;
    control: Control<QuestionBodyItf<FillGapsQuestionBodyItf>>;
    errors: FieldErrors<QuestionBodyItf<FillGapsQuestionBodyItf>>;
}> = ({ content, control, errors }) => {
    const { register } = control;
    return (
        <>
            <div className="flex flex-col items-start">
                <label htmlFor="num_gaps">Number of gaps: </label>
                <Input
                    type="number"
                    min={1}
                    {...register("content.num_gaps", {
                        required: "Number of gaps is required",
                        min: {
                            value: 1,
                            message: "Number of gaps must be at least 1",
                        },
                    })}
                    error={
                        errors.content?.num_gaps &&
                        errors.content.num_gaps.message
                    }
                />
            </div>
            <div className="flex flex-col mt-2">
                <label htmlFor="text">Text: </label>
                <Controller
                    name="content.text"
                    control={control}
                    rules={{
                        required: "Text is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextEditor
                            content={value}
                            setContent={onChange}
                            withInsertGapButton={true}
                        />
                    )}
                />
                <p className="text-right text-sm italic mt-2">
                    Place the cursor somewhere in the text and click Insert Gap
                    button{" "}
                </p>
                {errors.content?.text && (
                    <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                        {errors.content.text.message}
                    </p>
                )}
            </div>
        </>
    );
};

export default FillGapsQuestion;
