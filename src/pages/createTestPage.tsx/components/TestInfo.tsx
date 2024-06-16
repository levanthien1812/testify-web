import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { publicAnswersOptions, testLevels } from "../../../config/config";
import { TestFormDataItf, TestItf } from "../../../types/types";
import { createTest, updateTest } from "../../../services/test";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { testFormDataSchema } from "../../../validations/test";
import { formatTimezone } from "../../../utils/time";
import _, { set } from "lodash";

type SectionProps = {
    test: TestItf | null;
    onAfterUpdate: (testId: string) => void;
    onBack: () => void;
    onNext: () => void;
};

const TestInfo = ({ test, onAfterUpdate, onNext, onBack }: SectionProps) => {
    const [testFormData, setTestFormData] = useState<TestFormDataItf>({
        title: "",
        datetime: new Date(),
        description: "",
        duration: 0,
        max_score: 10,
        num_questions: 0,
        level: testLevels.EASY,
        num_parts: 1,
        close_time: new Date(),
        code: "",
        public_answers_option: publicAnswersOptions.SPECIFIC_DATE,
        public_answers_date: new Date(),
    });

    const [allowCloseTime, setAllowCloseTime] = useState(true);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const { mutate: createTestMutate, isLoading: createTestLoading } =
        useMutation({
            mutationFn: async (testFormData: TestFormDataItf) =>
                await createTest(testFormData),
            mutationKey: ["create-test", { body: testFormData }],
            onSuccess: (data) => {
                onAfterUpdate(data.test._id);
                onNext();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const { mutate: updateTestMutate, isLoading: updateTestLoading } =
        useMutation({
            mutationFn: async (testFormData: TestFormDataItf) =>
                await updateTest(test!._id, testFormData),
            mutationKey: [
                "update-test",
                { testId: test?._id, body: testFormData },
            ],
            onSuccess: (data) => {
                onAfterUpdate(data.test.id);
                onNext();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let name: string, value: string | number | Date;
        name = e.target.name;
        value = e.target.value;

        if (
            ["duration", "max_score", "num_parts", "num_questions"].includes(
                name
            )
        ) {
            value = parseInt(value);
        } else if (["datetime", "close_time"].includes(name)) {
            value = new Date(value);
        }
        setTestFormData({ ...testFormData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (test) {
            updateTestMutate(
                allowCloseTime
                    ? testFormData
                    : _.omit(testFormData, ["close_time"])
            );
        } else {
            createTestMutate(
                allowCloseTime
                    ? testFormData
                    : _.omit(testFormData, ["close_time"])
            );
        }
    };

    useEffect(() => {
        if (test) {
            setTestFormData({
                title: test.title,
                datetime: new Date(test.datetime),
                description: test.description,
                duration: test.duration,
                max_score: test.max_score,
                num_questions: test.num_questions,
                level: test.level,
                code: test.code,
                num_parts: test.num_parts,
                close_time: test.close_time
                    ? new Date(test.close_time)
                    : new Date(),
                public_answers_option: test.public_answers_option,
                public_answers_date: test.public_answers_date
                    ? new Date(test.public_answers_date)
                    : new Date(),
            });

            if (test.close_time) {
                setAllowCloseTime(true);
            } else {
                setAllowCloseTime(false);
            }
        }
    }, [test]);

    useEffect(() => {
        setTestFormData({
            ...testFormData,
            close_time: testFormData.datetime,
            public_answers_date: testFormData.datetime,
        });
    }, [testFormData.datetime]);

    useEffect(() => {
        if (
            testFormData.public_answers_option ===
                publicAnswersOptions.AFTER_CLOSE_TIME &&
            testFormData.close_time
        ) {
            setTestFormData({
                ...testFormData,
                public_answers_date: testFormData.close_time,
            });
        }
    }, [testFormData.public_answers_option, testFormData.close_time]);

    useEffect(() => {
        const { error } = testFormDataSchema.validate(testFormData);

        if (!error) setIsFinished(true);
        else setIsFinished(false);
    }, [testFormData]);

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Information</h2>

            <form className="mt-4 " onSubmit={handleSubmit}>
                <div className="flex gap-4 items-end">
                    <label htmlFor="title" className="w-1/5">
                        Test title:{" "}
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                        value={testFormData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="description" className="w-1/5">
                        Test description:{" "}
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                        value={testFormData.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="datetime" className="w-1/5">
                        Start time:{" "}
                    </label>
                    <input
                        type="datetime-local"
                        id="datetime"
                        name="datetime"
                        className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                        value={formatTimezone(testFormData.datetime)}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="duration" className="w-1/5 shrink-0">
                        Duration (mins):{" "}
                    </label>
                    <input
                        type="number"
                        step={5}
                        min={0}
                        id="duration"
                        name="duration"
                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow"
                        value={testFormData.duration}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="max_score" className="w-1/5 shrink-0">
                        Max score:{" "}
                    </label>
                    <input
                        type="number"
                        step={1}
                        min={0}
                        id="max_score"
                        name="max_score"
                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow"
                        value={testFormData.max_score}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <div className="w-1/5">
                        <label htmlFor="datetime">Close time: </label>
                        <input
                            type="checkbox"
                            checked={allowCloseTime}
                            onChange={() => setAllowCloseTime(!allowCloseTime)}
                        />
                    </div>

                    <input
                        type="datetime-local"
                        id="close_time"
                        name="close_time"
                        className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={formatTimezone(testFormData.close_time!)}
                        onChange={handleInputChange}
                        disabled={!allowCloseTime}
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="num_parts" className="w-1/5 shrink-0">
                        Number of parts:{" "}
                    </label>
                    <input
                        type="number"
                        step={1}
                        min={0}
                        id="num_parts"
                        name="num_parts"
                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow"
                        value={testFormData.num_parts}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="num_questions" className="w-1/5 shrink-0">
                        Num of questions:{" "}
                    </label>
                    <input
                        type="number"
                        step={1}
                        min={0}
                        id="num_questions"
                        name="num_questions"
                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow"
                        value={testFormData.num_questions}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="code" className="w-1/5 shrink-0">
                        Test code:{" "}
                    </label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow"
                        value={testFormData.code}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="level" className="w-1/5 shrink-0">
                        Level:{" "}
                    </label>
                    <select
                        id="level"
                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow capitalize"
                        name="level"
                        value={testFormData.level}
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

                <div className="flex gap-4 items-end mt-4">
                    <label
                        htmlFor="public_answers_option"
                        className="w-1/5 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        Public answers options:{" "}
                    </label>
                    <select
                        id="public_answers_option"
                        className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow capitalize"
                        name="public_answers_option"
                        value={testFormData.public_answers_option}
                        onChange={handleInputChange}
                    >
                        <option
                            value={publicAnswersOptions.AFTER_TAKER_SUBMISSION}
                        >
                            {publicAnswersOptions.AFTER_TAKER_SUBMISSION}
                        </option>
                        <option value={publicAnswersOptions.SPECIFIC_DATE}>
                            {publicAnswersOptions.SPECIFIC_DATE}
                        </option>
                        {allowCloseTime && (
                            <option
                                value={publicAnswersOptions.AFTER_CLOSE_TIME}
                            >
                                {publicAnswersOptions.AFTER_CLOSE_TIME}
                            </option>
                        )}
                    </select>
                </div>

                {testFormData.public_answers_option ===
                    publicAnswersOptions.SPECIFIC_DATE &&
                    testFormData.public_answers_date && (
                        <div className="flex gap-4 items-end mt-4">
                            <label
                                htmlFor="public_answers_date"
                                className="w-1/5 whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                Public answers date:{" "}
                            </label>
                            <input
                                type="datetime-local"
                                id="public_answers_date"
                                name="public_answers_date"
                                className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                                value={formatTimezone(
                                    testFormData.public_answers_date
                                )}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                    <button
                        className="text-white bg-orange-600 px-12 py-1 disabled:bg-gray-500"
                        type="button"
                        disabled
                    >
                        Back
                    </button>
                    <button
                        className="text-white bg-orange-600 px-12 py-1 hover:bg-orange-700 disabled:bg-gray-500"
                        type="submit"
                        disabled={
                            createTestLoading ||
                            updateTestLoading ||
                            !isFinished
                        }
                    >
                        {!(createTestLoading || updateTestLoading)
                            ? "Next"
                            : "Saving..."}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestInfo;
