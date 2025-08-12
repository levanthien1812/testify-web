import { useEffect, useState } from "react";
import Button from "../../../components/elements/Button";
import { useMutation } from "react-query";
import { publishTest } from "../../../services/test";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { TEST_STATUS } from "../../../config/constants/tests";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../hooks/hooks";

const StatusPanel = () => {
    const navigate = useNavigate();
    const { testId, status } = useAppSelector((state) => state.createTest);
    const [open, setOpen] = useState(false);
    const [dismissed, setDissmissed] = useState(false);

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
                navigate("/");
                // refetch();
            },
        });

    useEffect(() => {
        if (status === TEST_STATUS.DRAFT) {
            setOpen(false);
        }
        if (status === TEST_STATUS.PUBLISHABLE) {
            setOpen(true);
        }
    }, [status]);

    return (
        <>
            {open && (
                <div className="relative 2xl:w-3/5 mx-auto my-2 md:my-6">
                    {!dismissed && (
                        <div className="">
                            <div className=" bg-white p-2 sm:p-4 shadow-lg border border-orange-500">
                                {status === TEST_STATUS.PUBLISHABLE && (
                                    <div className="flex items-center gap-4">
                                        <p className="text-md grow">
                                            This test is now publishable!
                                        </p>
                                        <div className="flex gap-1 sm:gap-2">
                                            <Button
                                                secondary
                                                onClick={() =>
                                                    setDissmissed(true)
                                                }
                                            >
                                                Dismiss
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    publishTestMutate()
                                                }
                                                disabled={publishTestLoading}
                                            >
                                                {publishTestLoading
                                                    ? "Publishing..."
                                                    : "Publish"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {status === TEST_STATUS.PUBLISHED ||
                                    (status === TEST_STATUS.OPENED && (
                                        <div className="flex items-center gap-4 justify-between">
                                            <p>
                                                This test is now
                                                published/opened! Some fields
                                                will not be editable.
                                            </p>
                                            <Button
                                                primary
                                                onClick={() =>
                                                    setDissmissed(true)
                                                }
                                            >
                                                Got it!
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    {dismissed && (
                        <Button
                            onClick={() => setDissmissed(false)}
                            className="absolute top-0 right-0 z-10"
                            secondary
                        >
                            <FontAwesomeIcon icon={faInfo} />
                        </Button>
                    )}
                </div>
            )}
        </>
    );
};

export default StatusPanel;
