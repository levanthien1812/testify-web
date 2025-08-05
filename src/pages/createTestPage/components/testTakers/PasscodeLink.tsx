import { useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { useMutation, useQuery } from "react-query";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../../../config/constants/queryMutationKeys";
import { checkPasscode, getTestByCode } from "../../../../services/test";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../../stores/takeTest";
import { PasscodeItf } from "../../../../types/types";
import { useAppSelector } from "../../../../hooks/hooks";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { useNavigate } from "react-router";

type PasscodeLinkProps = {
    onClose: () => void;
    onSuccess: (data: PasscodeItf) => void;
    passCodeOnly?: boolean;
};

const PasscodeLink = ({
    onClose,
    onSuccess,
    passCodeOnly = false,
}: PasscodeLinkProps) => {
    const [currentOption, setCurrentOption] = useState<"PASSCODE" | "LINK">(
        "PASSCODE"
    );
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { passcode, testLink } = useAppSelector((state) => state.takeTest);
    const [storedPasscodes, setPasscodes] = useLocalStorage<string[]>(
        "passcodes",
        []
    );

    const { isLoading: isLoadingTest, refetch: refetchTest } = useQuery({
        queryFn: async () => {
            const data = await getTestByCode(passcode.code);
            return data.test;
        },
        queryKey: QUERY_KEYS.GET_TEST,
        enabled: false,
        onSuccess: (data: any) => {
            if (data) {
                navigate(`/tests/${data.id}`);
            }
            dispatch(takeTestActions.setIsPasscodeValidated(true));
            dispatch(takeTestActions.setIsEnteringPasscode(false));
            onClose();
        },
        onError: (err: any) => {
            if (err) {
                setError(err.response?.data?.message);
            }
        },
        retry: false,
    });

    const handleClickNext = () => {
        if (currentOption === "PASSCODE") {
            refetchTest();
        }
        if (currentOption === "LINK") {
        }
    };

    const handleClickSuggestedPasscode = (code: string) => {
        dispatch(
            takeTestActions.setPasscode({
                code,
            })
        );
    };

    return (
        <Modal onClose={onClose} allowClickBackdropToClose={false}>
            <ModalHeader title="Test passcode or link" />
            <ModalBody>
                {!passCodeOnly && (
                    <div className="flex w-full">
                        <Button
                            onClick={() => setCurrentOption("PASSCODE")}
                            className={`w-1/2`}
                            primary={currentOption === "PASSCODE"}
                            secondary={currentOption !== "PASSCODE"}
                        >
                            Passcode
                        </Button>
                        <Button
                            onClick={() => setCurrentOption("LINK")}
                            className={`w-1/2`}
                            primary={currentOption === "LINK"}
                            secondary={currentOption !== "LINK"}
                        >
                            Link
                        </Button>
                    </div>
                )}
                <div className="mt-2">
                    {currentOption === "PASSCODE" && (
                        <>
                            <Input
                                placeholder="Enter passcode"
                                className="px-4 py-2 text-2xl text-center"
                                onChange={(e) => {
                                    dispatch(
                                        takeTestActions.setPasscode({
                                            code: e.target.value.trim(),
                                        })
                                    );
                                }}
                                value={passcode.code}
                                {...(error ? { error } : {})}
                            />
                            {storedPasscodes.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                    {storedPasscodes.map((code: string) => (
                                        <button
                                            key={code}
                                            className="bg-gray-400 text-white rounded-sm px-2 py-1 text-center text-sm hover:bg-gray-500 transition-all duration-150 disabled:cursor-not-allowed"
                                            onClick={() =>
                                                handleClickSuggestedPasscode(
                                                    code
                                                )
                                            }
                                            type="button"
                                            disabled={passcode.code === code}
                                        >
                                            {code}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    {currentOption === "LINK" && (
                        <Input
                            placeholder="Enter link"
                            className="px-4 py-2 text-2xl text-center"
                        />
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleClickNext} disabled={isLoadingTest}>
                    {!isLoadingTest ? "Next" : "Validating..."}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default PasscodeLink;
