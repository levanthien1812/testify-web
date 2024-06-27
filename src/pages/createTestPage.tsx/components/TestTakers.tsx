import { ChangeEvent, useState } from "react";
import { TestItf } from "../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Takers from "./testTakers/Takers";
import { useMutation } from "react-query";
import { updateTest } from "../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Button from "../../../components/elements/Button";
import Select from "../../../components/elements/Select";

type SectionProps = {
    test: TestItf;
    onAfterUpdate: () => void;
    onBack: () => void;
    onNext: () => void;
};

const TestTakers = ({ test, onAfterUpdate, onBack, onNext }: SectionProps) => {
    const [shareOption, setShareOption] = useState<"restricted" | "anyone">(
        "restricted"
    );
    const navigate = useNavigate();

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            await updateTest(test._id, { share_option: shareOption });
        },
        mutationKey: ["updateTest", { body: { share_option: shareOption } }],
        onSuccess: () => {
            onAfterUpdate();
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleNext = () => {
        mutate();
        navigate("/home");
    };

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Takers</h2>
            <p className="text-center">
                Create test taker's accounts so that they can access the test
                and do it.
            </p>

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

            {shareOption === "restricted" && (
                <Takers test={test} onAfterUpdate={onAfterUpdate} />
            )}

            <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                <Button size="lg" onClick={onBack}>
                    Back
                </Button>
                <Button size="lg" onClick={handleNext} disabled={isLoading}>
                    Finish
                </Button>
            </div>
        </div>
    );
};

export default TestTakers;
