import { useState } from "react";
import Accordion from "../../../../components/accordions/Accordion";
import { useFormContext } from "react-hook-form";
import TestOption from "./TestOption";
import Checkbox from "../../../../components/elements/Checkbox";
import { RootState } from "../../../../stores/rootState";
import { useSelector } from "react-redux";
import {
    ALLOWED_MAXIMUM_SUBMISSIONS,
    PUBLIC_ANSWERS_OPTIONS,
    PUBLIC_ANSWERS_OPTIONS_LABEL,
    TEST_OPTIONS_LABELS,
} from "../../../../config/constants/tests";
import Input from "../../../../components/elements/Input";
import Select from "../../../../components/elements/Select";

const TestOptions = () => {
    const [isViewingOptions, setIsViewOptions] = useState(false);
    const { register } = useFormContext();
    const { options, editibility } = useSelector(
        (state: RootState) => state.createTest
    );

    return (
        <Accordion
            viewData={{
                title: {
                    text: "Options",
                    extraClass: "capitalize",
                },
                extraClass: "mt-4",
                open: isViewingOptions,
                onToggle: () => setIsViewOptions(!isViewingOptions),
            }}
        >
            <div className="flex-col space-y-2 p-4">
                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS.ALLOW_CLOSE_TIME
                                    .MAKER,
                            }}
                            {...register("options.allow_close_time.enable")}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_close_time
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_close_time.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                    additionalInfo={
                        options.allow_close_time.enable && (
                            <div className="grid grid-cols-[2fr_5fr] px-4 py-2 bg-orange-50">
                                <Input
                                    type="datetime-local"
                                    {...register(
                                        "options.allow_close_time.close_time"
                                    )}
                                    label={{
                                        text: "Close time",
                                    }}
                                    disabled={
                                        !editibility.TEST_INFORMATION.options
                                            .allow_close_time
                                    }
                                />
                            </div>
                        )
                    }
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS
                                    .ALLOW_VIEW_SUBMISSION_AFTER_TEST.MAKER,
                            }}
                            {...register(
                                "options.allow_view_submission_after_test.enable"
                            )}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_view_submission_after_test
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_view_submission_after_test.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS
                                    .ALLOW_MULTIPLE_SUBMISSIONS.MAKER,
                            }}
                            {...register(
                                "options.allow_multiple_submissions.enable"
                            )}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_multiple_submissions
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_multiple_submissions.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                    additionalInfo={
                        options.allow_multiple_submissions.enable && (
                            <div className="grid grid-cols-[2fr_5fr] px-4 py-2 bg-orange-50">
                                <Input
                                    type="number"
                                    {...register(
                                        "options.allow_multiple_submissions.maximum_submissions"
                                    )}
                                    label={{
                                        text: "Maximum submissions",
                                    }}
                                    disabled={
                                        !editibility.TEST_INFORMATION.options
                                            .allow_multiple_submissions
                                    }
                                    min={2}
                                    max={ALLOWED_MAXIMUM_SUBMISSIONS}
                                    helperText="Allowed maximum submissions is 10"
                                />
                            </div>
                        )
                    }
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS.ALLOW_SAVE_PROGRESS
                                    .MAKER,
                            }}
                            {...register("options.allow_save_progress.enable")}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_save_progress
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_save_progress.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS
                                    .ALLOW_SHOW_TAKER_ANSWERS_AFTER_TEST.MAKER,
                            }}
                            {...register(
                                "options.allow_show_taker_answers_after_test.enable"
                            )}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_show_taker_answers_after_test
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_show_taker_answers_after_test.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS
                                    .ALLOW_SHOW_MAKER_ANSWERS_AFTER_TEST.MAKER,
                            }}
                            {...register(
                                "options.allow_show_maker_answers_after_test.enable"
                            )}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_show_maker_answers_after_test
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_show_maker_answers_after_test.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                    additionalInfo={
                        options.allow_show_maker_answers_after_test.enable && (
                            <div className="grid grid-cols-[2fr_5fr] gap-2 px-4 py-2 bg-orange-50">
                                <Select
                                    className="w-0 grow capitalize"
                                    {...register(
                                        "options.allow_show_maker_answers_after_test.public_answers_option",
                                        {
                                            required:
                                                "Public answers option is required",
                                        }
                                    )}
                                    label={{
                                        text: "Public answers options",
                                    }}
                                    options={Object.values(
                                        PUBLIC_ANSWERS_OPTIONS
                                    ).map((publicAnswersOption) => ({
                                        label: PUBLIC_ANSWERS_OPTIONS_LABEL[
                                            publicAnswersOption
                                        ],
                                        value: publicAnswersOption,
                                    }))}
                                    disabled={
                                        !editibility.TEST_INFORMATION.options
                                            .allow_show_maker_answers_after_test
                                    }
                                />

                                {options.allow_show_maker_answers_after_test
                                    .public_answers_option ===
                                    PUBLIC_ANSWERS_OPTIONS.SPECIFIC_DATE && (
                                    <Input
                                        type="datetime-local"
                                        label={{
                                            text: "Public answers date",
                                        }}
                                        {...register(
                                            "options.allow_show_maker_answers_after_test.public_answers_date",
                                            {
                                                required:
                                                    "Public answers date is required",
                                            }
                                        )}
                                        disabled={
                                            !editibility.TEST_INFORMATION
                                                .options
                                                .allow_show_maker_answers_after_test
                                        }
                                    />
                                )}
                            </div>
                        )
                    }
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS
                                    .ALLOW_SHUFFLE_QUESTIONS.MAKER,
                            }}
                            {...register(
                                "options.allow_shuffle_questions.enable"
                            )}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_shuffle_questions
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_shuffle_questions.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS.ALLOW_SHUFFLE_ANSWERS
                                    .MAKER,
                            }}
                            {...register(
                                "options.allow_shuffle_answers.enable"
                            )}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_shuffle_answers
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_shuffle_answers.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS
                                    .ALLOW_REVIEW_BEFORE_SUBMISSION.MAKER,
                            }}
                            {...register(
                                "options.allow_review_before_submission.enable"
                            )}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .allow_review_before_submission
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.allow_review_before_submission.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                />

                <TestOption
                    mainOption={
                        <Checkbox
                            label={{
                                text: TEST_OPTIONS_LABELS.DISALLOW_TIME_LIMIT
                                    .MAKER,
                            }}
                            {...register("options.disallow_time_limit.enable")}
                            disabled={
                                !editibility.TEST_INFORMATION.options
                                    .disallow_time_limit
                            }
                        />
                    }
                    subOptions={[
                        <Checkbox
                            label={{ text: "Let taker know" }}
                            sizing="sm"
                            {...register(
                                "options.disallow_time_limit.let_taker_know"
                            )}
                            className="ms-8"
                        />,
                    ]}
                />
            </div>
        </Accordion>
    );
};

export default TestOptions;
