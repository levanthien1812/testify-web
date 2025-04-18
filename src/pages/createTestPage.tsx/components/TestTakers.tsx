import { ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Takers from "./testTakers/Takers";
import { useMutation } from "react-query";
import { assignTakers, updateTest } from "../../../services/test";
import { useNavigate } from "react-router";
import Select from "../../../components/elements/Select";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import CopyLink from "./testTakers/CopyLink";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { SHARE_OPTIONS } from "../../../config/constants/tests";
import Passcode from "./testTakers/Passcode";
import { TestBodyItf } from "../../../types/types";
import Anyone from "./testTakers/Anyone";

const TestTakers = () => {
    const {
        testId,
        shareOption,
        testLink,
        testTakers,
        passcode,
        isValidShareOption,
        editibility,
    } = useSelector((state: RootState) => state.createTest);
    const navigate = useNavigate();
    const { moveNextStep, movePrevStep, validate } = createTestActions;
    const dispatch = useDispatch();

    const { mutate: updateTestMutate, isLoading: isUpdatingTest } = useMutation(
        {
            mutationFn: async (updateData: Partial<TestBodyItf>) => {
                await updateTest(testId!, updateData);
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

    const { mutate: assignTakersMutate, isLoading: isAssigningTakers } =
        useMutation({
            mutationFn: async () => {
                await assignTakers(
                    testId!,
                    testTakers!.map((taker) => taker.email)
                );
            },
            onSuccess: () => {
                // onClose();
            },
        });

    useEffect(() => {
        if (shareOption === SHARE_OPTIONS.ANYONE) {
            dispatch(createTestActions.generateTestLink());
        }
    }, [dispatch, shareOption]);

    useEffect(() => {
        dispatch(validate());
    }, [validate, dispatch]);

    const handleSaveTestTakers = async () => {
        updateTestMutate({ share_option: shareOption });
        switch (shareOption) {
            case SHARE_OPTIONS.RESTRICTED:
                assignTakersMutate();
                break;
            case SHARE_OPTIONS.PASSCODE:
                updateTestMutate({ passcode: passcode.id });
                break;
            default:
                break;
        }
    };

    const handleChangeShareOption = (value: string) => {
        dispatch(createTestActions.saveTestInfo({ share_option: value }));
        dispatch(validate());
    };

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
                        text: "Save & Finish",
                        loadingText: "Finishing...",
                        onClick: () => {
                            handleSaveTestTakers();
                        },
                        disabled:
                            isUpdatingTest ||
                            isAssigningTakers ||
                            !isValidShareOption,
                        isLoading: isUpdatingTest || isAssigningTakers,
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
                <label htmlFor="share-select">Choose access method: </label>
                <Select
                    name="share-select"
                    id="share-select"
                    value={shareOption}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleChangeShareOption(e.target.value)
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
                    disabled={!editibility.TEST_TAKERS.share_option}
                />
                <div className="flex items-center gap-2 mt-1">
                    <FontAwesomeIcon icon={faInfoCircle} />

                    <p className="text-gray-700 italic">
                        {shareOption === SHARE_OPTIONS.ANYONE &&
                            "Anyone with the test's link can access the test"}
                        {shareOption === SHARE_OPTIONS.RESTRICTED &&
                            "Only those whose email included in the specified emails can access the test"}
                        {shareOption === SHARE_OPTIONS.PASSCODE &&
                            "Anyone with valid passcode can access the test"}
                    </p>
                </div>
            </div>
            {shareOption === SHARE_OPTIONS.ANYONE && <Anyone />}

            {shareOption === SHARE_OPTIONS.RESTRICTED && <Takers />}

            {shareOption === SHARE_OPTIONS.PASSCODE && <Passcode />}
        </Wrapper>
    );
};

export default TestTakers;
