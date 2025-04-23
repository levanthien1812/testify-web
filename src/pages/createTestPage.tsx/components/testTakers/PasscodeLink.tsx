import { useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { checkPasscode } from "../../../../services/test";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../../stores/takeTest";
import { PasscodeItf } from "../../../../types/types";
import { useAppSelector } from "../../../../hooks/hooks";
import useLocalStorage from "../../../../hooks/useLocalStorage";

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
    const { passcode, testLink } = useAppSelector((state) => state.takeTest);
    const [storedPasscodes, setStoredPasscodes] = useLocalStorage(
        "passcodes",
        []
    );

    const { mutate: checkPasscodeMutate, isLoading: isCheckingPasscode } =
        useMutation({
            mutationFn: async () => {
                const responseData = await checkPasscode(passcode.code);
                return responseData.passcode;
            },
            mutationKey: MUTATION_KEYS.CHECK_PASSCODE,
            onError: (err: any) => {
                if (err) {
                    setError(err.response?.data?.message);
                }
            },
            onSuccess: (data: PasscodeItf) => {
                if (!storedPasscodes.includes(passcode.code)) {
                    setStoredPasscodes([...storedPasscodes, passcode.code]);
                }
                onSuccess(data);
            },
        });

    const handleClickNext = () => {
        if (currentOption === "PASSCODE") {
            checkPasscodeMutate();
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
        <Modal onClose={onClose}>
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
                    )}
                    {currentOption === "LINK" && (
                        <Input
                            placeholder="Enter link"
                            className="px-4 py-2 text-2xl text-center"
                        />
                    )}
                </div>
                {storedPasscodes.length > 0 && (
                    <div className="flex gap-1 mt-2">
                        {storedPasscodes.map((code: string) => (
                            <button
                                key={code}
                                className="bg-gray-400 text-white rounded-sm px-2 py-1 text-center text-sm hover:bg-gray-500 transition-all duration-150 disabled:cursor-not-allowed"
                                onClick={() =>
                                    handleClickSuggestedPasscode(code)
                                }
                                type="button"
                                disabled={passcode.code === code}
                            >
                                {code}
                            </button>
                        ))}
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleClickNext} disabled={isCheckingPasscode}>
                    {!isCheckingPasscode ? "Next" : "Validating..."}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default PasscodeLink;
