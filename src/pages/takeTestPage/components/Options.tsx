import Checkbox from "../../../components/elements/Checkbox";
import { TEST_OPTIONS_LABELS } from "../../../config/constants/tests";
import { useAppSelector } from "../../../hooks/hooks";

const Options = () => {
    const { test, submissionsCount } = useAppSelector(
        (state) => state.takeTest
    );
    return (
        <div className="mt-3 space-y-2">
            {test?.options.allow_close_time.let_taker_know && (
                <Checkbox
                    label={{ text: TEST_OPTIONS_LABELS.ALLOW_CLOSE_TIME.TAKER }}
                    checked={test.options.allow_close_time.enable}
                    disabled
                />
            )}
            {test?.options.allow_multiple_submissions.let_taker_know && (
                <div className="flex items-center gap-3">
                    <Checkbox
                        label={{
                            text: TEST_OPTIONS_LABELS.ALLOW_MULTIPLE_SUBMISSIONS
                                .TAKER,
                        }}
                        checked={test.options.allow_multiple_submissions.enable}
                        disabled
                    />
                    {submissionsCount && (
                        <div className="text-sm text-gray-500">
                            Your submissions: {submissionsCount}
                        </div>
                    )}
                    {test.options.allow_multiple_submissions
                        .maximum_submissions && (
                        <div className="text-sm text-gray-500">
                            Maximum submissions:{" "}
                            {
                                test.options.allow_multiple_submissions
                                    .maximum_submissions
                            }
                        </div>
                    )}
                </div>
            )}
            {test?.options.allow_review_before_submission.let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS.ALLOW_REVIEW_BEFORE_SUBMISSION
                            .TAKER,
                    }}
                    checked={test.options.allow_review_before_submission.enable}
                    disabled
                />
            )}
            {test?.options.allow_save_progress.let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS.ALLOW_SAVE_PROGRESS.TAKER,
                    }}
                    checked={test.options.allow_save_progress.enable}
                    disabled
                />
            )}
            {test?.options.allow_show_maker_answers_after_test
                .let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS
                            .ALLOW_SHOW_MAKER_ANSWERS_AFTER_TEST.TAKER,
                    }}
                    checked={
                        test.options.allow_show_maker_answers_after_test.enable
                    }
                    disabled
                />
            )}
            {test?.options.allow_show_taker_answers_after_test
                .let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS
                            .ALLOW_SHOW_TAKER_ANSWERS_AFTER_TEST.TAKER,
                    }}
                    checked={
                        test.options.allow_show_taker_answers_after_test.enable
                    }
                    disabled
                />
            )}
            {test?.options.allow_shuffle_answers.let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS.ALLOW_SHUFFLE_ANSWERS.TAKER,
                    }}
                    checked={test.options.allow_shuffle_answers.enable}
                    disabled
                />
            )}
            {test?.options.allow_shuffle_questions.let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS.ALLOW_SHUFFLE_QUESTIONS.TAKER,
                    }}
                    checked={test.options.allow_shuffle_questions.enable}
                    disabled
                />
            )}
            {test?.options.allow_view_submission_after_test.let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS
                            .ALLOW_VIEW_SUBMISSION_AFTER_TEST.TAKER,
                    }}
                    checked={
                        test.options.allow_view_submission_after_test.enable
                    }
                    disabled
                />
            )}
            {test?.options.disallow_time_limit.let_taker_know && (
                <Checkbox
                    label={{
                        text: TEST_OPTIONS_LABELS.DISALLOW_TIME_LIMIT.TAKER,
                    }}
                    checked={test.options.disallow_time_limit.enable}
                    disabled
                />
            )}
        </div>
    );
};

export default Options;
