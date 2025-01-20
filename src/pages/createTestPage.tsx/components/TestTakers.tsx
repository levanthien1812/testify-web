import { ChangeEvent, useState } from "react";
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

const TestTakers = () => {
    const { testId } = useSelector((state: RootState) => state.createTest);
    const [shareOption, setShareOption] = useState<"restricted" | "anyone">(
        "restricted"
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
                "updateTest",
                { body: { share_option: shareOption } },
            ],
            onSuccess: () => {
                dispatch(moveNextStep());
            },
        }
    );

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
                        onClick: () => {
                            dispatch(movePrevStep());
                        },
                        text: "Finish",
                    },
                    outlinedButton: {
                        disabled: isUpdatingTest,
                        loadingText: "Updating...",
                        isLoading: isUpdatingTest,
                        onClick: () => {
                            updateTestMutate();
                        },
                        text: "Cancel",
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
                        setShareOption(
                            e.target.value as "anyone" | "restricted"
                        )
                    }
                    options={[
                        { value: "anyone", label: "Anyone with the link" },
                        { value: "restricted", label: "Restricted" },
                    ]}
                />
                <div className="flex items-center gap-2 mt-1">
                    <FontAwesomeIcon icon={faInfoCircle} />

                    <p className="text-gray-700 italic">
                        {shareOption === "anyone"
                            ? "Anyone with the test's link can access the test and do it"
                            : "Only those whose email included in the specified emails can access the test"}
                    </p>
                </div>
            </div>
            {shareOption === "anyone" && <CopyLink link="" />}

            {shareOption === "restricted" && <Takers />}
        </Wrapper>
    );
};

export default TestTakers;
