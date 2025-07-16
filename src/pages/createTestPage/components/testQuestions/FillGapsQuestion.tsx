import React, { useEffect, useMemo, useState } from "react";
import {
    FillGapsQuestionBodyItf,
    QuestionBodyItf,
} from "../../../../types/types";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import Input from "../../../../components/elements/Input";
import {
    Control,
    Controller,
    FieldErrors,
    useFieldArray,
    UseFormSetValue,
} from "react-hook-form";
import {
    FILL_GAP_INDICATOR,
    FILL_GAP_METHOD,
    FILL_GAP_METHOD_OPTIONS,
} from "../../../../config/constants/tests";
import { getNum } from "../../../../utils/primitives";
import Select from "../../../../components/elements/Select";

const FillGapsQuestion: React.FC<{
    content: FillGapsQuestionBodyItf;
    control: Control<QuestionBodyItf<FillGapsQuestionBodyItf>>;
    errors: FieldErrors<QuestionBodyItf<FillGapsQuestionBodyItf>>;
    setValue: UseFormSetValue<QuestionBodyItf<FillGapsQuestionBodyItf>>;
}> = ({ content, control, errors, setValue }) => {
    const { register } = control;
    const [newWord, setNewWord] = useState("");

    const {
        fields: words,
        append,
        remove,
    } = useFieldArray<QuestionBodyItf<FillGapsQuestionBodyItf>>({
        control,
        name: "content.given_words",
        rules: {
            validate: (value) => {
                if (value.length < content.num_gaps) {
                    return "Number of words must be greater than or equal to number of gaps";
                }
                return true;
            },
        },
    });

    const removeWord = (index: number) => {
        remove(index);
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (newWord.length === 0) return;
            append({ text: newWord });
            setNewWord("");
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (newWord.length === 0) return;
        if (e.relatedTarget === null) {
            append({ text: newWord });
            setNewWord("");
        }
    };

    return (
        <>
            <div className="flex flex-col">
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
                    label={{
                        text: "Number of gaps",
                    }}
                />
            </div>
            <div className="flex flex-col mt-2">
                <label htmlFor="text">Text: </label>
                <Controller
                    name="content.text"
                    control={control}
                    rules={{
                        required: "Text is required",
                        validate: (value) => {
                            if (!value.includes(FILL_GAP_INDICATOR)) {
                                return "Text must contain at least one gap";
                            }
                            const noOfGaps =
                                value.split(FILL_GAP_INDICATOR).length - 1;
                            if (noOfGaps !== getNum(content.num_gaps)) {
                                return `Text must contain ${content.num_gaps} gaps`;
                            }

                            return true;
                        },
                    }}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <TextEditor
                                content={value}
                                setContent={onChange}
                                setJson={(json) => {
                                    setValue("content.json_text", json);
                                }}
                                withInsertGapButton={true}
                            />
                        );
                    }}
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
            <div className="flex flex-col">
                <Select
                    options={FILL_GAP_METHOD_OPTIONS}
                    {...register("content.fill_method", {
                        required: "Fill method is required",
                    })}
                    error={
                        errors.content?.fill_method &&
                        errors.content.fill_method.message
                    }
                    label={{
                        text: "Fill method",
                    }}
                />
            </div>
            {content.fill_method === FILL_GAP_METHOD.DRAG_DROP && (
                <div className="mt-2">
                    <label htmlFor="new-word">Provide words to fill in:</label>

                    <div className="flex gap-1 flex-wrap">
                        {words.map((word, index) => (
                            <button
                                key={word.id}
                                className="border border-orange-500 bg-orange-50 text-orange-600 px-4 py-1 leading-none"
                                onClick={() => removeWord(index)}
                            >
                                {word.text}
                            </button>
                        ))}
                        <input
                            id="new-word"
                            type="text"
                            placeholder="Enter word"
                            onKeyDown={handlePressEnter}
                            onBlur={handleBlur}
                            className="bg-white text-orange-600 border border-orange-600 px-4 py-1 leading-none outline-none w-fit max-w-[100px] text-nowrap"
                            onChange={(e) => {
                                setNewWord(e.target.value);
                            }}
                            value={newWord}
                        />
                    </div>

                    <p className="italic text-gray-500 text-sm text-end mt-1">
                        Tap word to remove!
                    </p>
                    {errors.content?.given_words && (
                        <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                            {errors.content.given_words.root?.message}
                        </p>
                    )}
                </div>
            )}
        </>
    );
};

export default FillGapsQuestion;
