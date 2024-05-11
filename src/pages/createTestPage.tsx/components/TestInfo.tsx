import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { testLevels } from "../../../config/config";
import { TestFormDataItf, TestItf } from "../../../types/types";
import { createTest } from "../../../services/test";
import { useMutation } from "react-query";

const TestInfo: React.FC<{
    test: TestItf | null;
    setTest: React.Dispatch<React.SetStateAction<TestItf | null>>;
    numParts: number;
    setNumParts: React.Dispatch<React.SetStateAction<number>>;
    onNext: () => void;
}> = ({ test, setTest, numParts, setNumParts, onNext }) => {
    const [testFormData, setTestFormData] = useState<TestFormDataItf>({
        title: "",
        datetime: new Date(),
        description: "",
        duration: 0,
        max_score: 10,
        num_questions: 0,
        level: testLevels.EASY,
        code: "",
    });

    const [isFinished, setIsFinished] = useState<boolean>(false);

    const { mutate, isLoading, isError } = useMutation({
        mutationFn: (testFormData: TestFormDataItf) => createTest(testFormData),
        mutationKey: ["create-test", { body: testFormData }],
        onSuccess: (data) => {
            setTest(data.test);
            onNext();
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
        } else if (name === "datetime") {
            value = new Date(value);
        }
        setTestFormData({ ...testFormData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (test) {
            setTest(test);
            onNext();
            return;
        }

        mutate(testFormData);
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
            });
        }
    }, [test]);

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
                        Test date & time:{" "}
                    </label>
                    <input
                        type="datetime-local"
                        id="datetime"
                        name="datetime"
                        className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                        value={
                            testFormData.datetime.toISOString().split(".")[0]
                        }
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
                        value={numParts}
                        onChange={(e) => setNumParts(parseInt(e.target.value))}
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

                <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                    <button
                        className="text-white bg-orange-600 px-12 py-1 disabled:bg-gray-500"
                        type="button"
                        disabled
                    >
                        Back
                    </button>
                    <button
                        className="text-white bg-orange-600 px-12 py-1 hover:bg-orange-700"
                        type="submit"
                        disabled={isLoading}
                    >
                        {!isLoading ? "Next" : "Saving..."}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestInfo;