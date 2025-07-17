import React from "react";
import {
    QuestionBodyItf,
    TrueFalseQuestionBodyItf,
} from "../../../../types/types";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { useAppSelector } from "../../../../hooks/hooks";
import Input from "../../../../components/elements/Input";

const TrueFalseQuestion: React.FC<{
    content: TrueFalseQuestionBodyItf;
    control: Control<QuestionBodyItf<TrueFalseQuestionBodyItf>>;
    errors: FieldErrors<QuestionBodyItf<TrueFalseQuestionBodyItf>>;
}> = ({ content, control, errors }) => {
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
        </>
    );
};

export default TrueFalseQuestion;
