import React, { ChangeEvent, useEffect, useState } from "react";
import {
    FillGapsQuestionFormDataItf,
    MatchingQuestionFormDataItf,
    MultipleChoiceQuestionFormDataItf,
    QuestionFormDataItf,
    QuestionItf,
} from "../../../../types/types";
import Modal from "../../../../components/modals/Modal";
import { questionTypes, testLevels } from "../../../../config/config";
import MulitpleChoiceQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";

const Question: React.FC<{ question: QuestionItf }> = ({ question }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [questionFormData, setQuestionFormData] =
        useState<QuestionFormDataItf>({
            score: 0,
            level: testLevels.EASY,
            type: questionTypes.MULITPLE_CHOICES,
            content: {
                allow_multiple: false,
                options: [],
                text: "",
            },
        });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let name: string, value: string | number | Date;
        name = e.target.name;
        value = e.target.value;

        if (["score"].includes(name)) {
            value = parseInt(value);
        }

        if (name.includes("content")) {
            let content;

            switch (questionFormData.type) {
                case questionTypes.MULITPLE_CHOICES:
                    content = {
                        ...questionFormData,
                        [name.split(".")[1]]: value,
                    };
            }
            setQuestionFormData({
                ...questionFormData,
                content: { ...questionFormData.content },
            });
        }

        setQuestionFormData({ ...questionFormData, [name]: value });
    };

    useEffect(() => {
        console.log(questionFormData.type);
        switch (questionFormData.type) {
            case questionTypes.MULITPLE_CHOICES:
                setQuestionFormData({
                    ...questionFormData,
                    content: {
                        allow_multiple: false,
                        options: [],
                        text: "",
                    },
                });
                break;
            case questionTypes.FILL_GAPS:
                setQuestionFormData({
                    ...questionFormData,
                    content: {
                        text: "",
                    },
                });
                break;
            case questionTypes.MATCHING:
                setQuestionFormData({
                    ...questionFormData,
                    content: {
                        text: "",
                        left_items: [],
                        right_items: [],
                    },
                });
                break;
        }
    }, [questionFormData.type]);
    return (
        <>
            <div
                className="bg-orange-100 p-2 text-center cursor-pointer hover:bg-orange-200"
                onClick={() => setOpen(true)}
            >
                Question {question.order}
            </div>
            {open && (
                <Modal
                    title={`Question ${question.order}`}
                    onClose={() => setOpen(false)}
                >
                    <div className="w-[600px] flex gap-4">
                        <div className="space-y-4 gap-4 w-1/3">
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
                                    <option value={testLevels.EASY}>
                                        {testLevels.EASY}
                                    </option>
                                    <option value={testLevels.MEDIUM}>
                                        {testLevels.MEDIUM}
                                    </option>
                                    <option value={testLevels.HARD}>
                                        {testLevels.HARD}
                                    </option>
                                    <option value={testLevels.VERY_HARD}>
                                        {testLevels.VERY_HARD}
                                    </option>
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
                                        value={questionTypes.MULITPLE_CHOICES}
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
                        <div className="grow">
                            {questionFormData.type ===
                                questionTypes.MULITPLE_CHOICES && (
                                <MulitpleChoiceQuestion
                                    content={
                                        questionFormData.content as MultipleChoiceQuestionFormDataItf
                                    }
                                    onInputChange={handleInputChange}
                                />
                            )}
                            {questionFormData.type ===
                                questionTypes.FILL_GAPS && (
                                <FillGapsQuestion
                                    content={
                                        questionFormData.content as FillGapsQuestionFormDataItf
                                    }
                                    onInputChange={handleInputChange}
                                />
                            )}
                            {questionFormData.type ===
                                questionTypes.MATCHING && (
                                <MatchingQuestion
                                    content={
                                        questionFormData.content as MatchingQuestionFormDataItf
                                    }
                                    onInputChange={handleInputChange}
                                />
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Question;
