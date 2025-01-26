import { ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Takers from "./testTakers/Takers";
import { useMutation } from "react-query";
import { updateTest } from "../../../services/test";
import { useNavigate } from "react-router";
import Select from "../../../components/elements/Select";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import CopyLink from "./testTakers/CopyLink";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { SHARE_OPTIONS } from "../../../config/config";
import Passcode from "./testTakers/Passcode";

const TestTakers = () => {
    const { testId, shareOption, testLink } = useSelector(
        (state: RootState) => state.createTest
    );
    const navigate = useNavigate();
    const { moveNextStep, movePrevStep } = createTestActions;
    const dispatch = useDispatch();

    const { mutate: updateTestMutate, isLoading: isUpdatingTest } = useMutation(
        {
            mutationFn: async () => {
                await updateTest(testId!, { share_option: shareOption });
            },
            mutationKey: [
                MUTATION_KEYS.UPDATE_TEST,
                { body: { share_option: shareOption } },
            ],
            onSuccess: () => {
                dispatch(moveNextStep());
                navigate("/tests");
            },
        }
    );

    useEffect(() => {
        if (shareOption === SHARE_OPTIONS.ANYONE) {
            dispatch(createTestActions.generateTestLink());
        }
    }, [dispatch, shareOption]);

    return (
        <Wrapper
            viewData={{
                headerTitle: {
                    text: "Test Takers",
                    description: {
                        text: "Create test taker's accounts so that they can access the test and do it.",
                    },
                },
                bottomButtons: {
                    containButton: {
                        text: "Finish",
                        loadingText: "Finishing...",
                        onClick: () => {
                            updateTestMutate();
                        },
                        disabled: isUpdatingTest,
                        isLoading: isUpdatingTest,
                    },
                    outlinedButton: {
                        onClick: () => {
                            dispatch(movePrevStep());
                        },
                        text: "Back",
                    },
                },
            }}
        >
            <div className="mt-4 px-8 py-4 bg-orange-100 space-x-2">
                <label htmlFor="share-select">Share the test with: </label>
                <Select
                    name="share-select"
                    id="share-select"
                    value={shareOption}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        dispatch(
                            createTestActions.saveTestInfo({
                                share_option: e.target.value,
                            })
                        )
                    }
                    options={[
                        {
                            value: SHARE_OPTIONS.ANYONE,
                            label: "Anyone with the link",
                        },
                        {
                            value: SHARE_OPTIONS.RESTRICTED,
                            label: "Restricted",
                        },
                        {
                            value: SHARE_OPTIONS.PASSCODE,
                            label: "Passcode",
                        },
                    ]}
                />
                <div className="flex items-center gap-2 mt-1">
                    <FontAwesomeIcon icon={faInfoCircle} />

                    <p className="text-gray-700 italic">
                        {shareOption === SHARE_OPTIONS.ANYONE
                            ? "Anyone with the test's link can access the test and do it"
                            : "Only those whose email included in the specified emails can access the test"}
                    </p>
                </div>
            </div>
            {shareOption === SHARE_OPTIONS.ANYONE && (
                <div className="p-2 bg-orange-100">
                    <div className="border-2 border-orange-500 border-dashed">
                        <CopyLink link={testLink} />
                    </div>
                </div>
            )}

            {shareOption === SHARE_OPTIONS.RESTRICTED && <Takers />}

            {shareOption === SHARE_OPTIONS.PASSCODE && <Passcode />}
        </Wrapper>
    );
};

export default TestTakers;
