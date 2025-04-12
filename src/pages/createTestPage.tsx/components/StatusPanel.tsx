import React, { useState } from "react";
import Button from "../../../components/elements/Button";
import { useMutation } from "react-query";
import { publishTest } from "../../../services/test";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { TEST_STATUS } from "../../../config/constants/tests";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

const StatusPanel = () => {
    const navigate = useNavigate();
    const { testId, status } = useSelector(
        (state: RootState) => state.createTest
    );
    const [open, setOpen] = useState(true);

    const { mutate: publishTestMutate, isLoading: publishTestLoading } =
        useMutation({
            mutationFn: async () => {
                await publishTest(testId!);
            },
            mutationKey: [
                MUTATION_KEYS.UPDATE_TEST,
                testId,
                { body: { status: TEST_STATUS.PUBLISHED } },
            ],
            onSuccess: () => {
                toast.success(TOAST_MESSAGES.PUBLISHED_TEST_SUCCESSFULLY);
                navigate("/home");
                // refetch();
            },
        });

    return (
        <div className="relative 2xl:w-3/5 w-4/5 mx-auto my-6">
            {open && (
                <div className=" bg-white p-4 shadow-lg border border-orange-500">
                    {status === TEST_STATUS.PUBLISHABLE && (
                        <div className="flex items-center gap-4">
                            <p className="text-xl grow">
                                This test is now publishable!
                            </p>
                            <Button
                                className=" uppercase"
                                size="lg"
                                onClick={() => publishTestMutate()}
                                disabled={publishTestLoading}
                            >
                                {publishTestLoading
                                    ? "Publishing..."
                                    : "Publish"}
                            </Button>
                        </div>
                    )}
                    {status === TEST_STATUS.PUBLISHED ||
                        (status === TEST_STATUS.OPENED && (
                            <div>
                                <p>
                                    This test is now published/opened! Some
                                    fields will not be editable.
                                </p>
                            </div>
                        ))}
                    <div className="flex justify-end mt-2">
                        <Button
                            primary={false}
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            )}
            {!open && (
                <Button
                    onClick={() => setOpen(true)}
                    className="absolute top-0 right-0 z-10"
                >
                    <FontAwesomeIcon icon={faInfo} />
                </Button>
            )}
        </div>
    );
};

export default StatusPanel;
