import React, { useCallback, useMemo, useState } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "./Modal";
import Button from "../elements/Button";
import Input from "../elements/Input";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../config/constants/queryMutationKeys";
import { checkPasscode } from "../../services/test";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../stores/takeTest";
import { useNavigate } from "react-router";
import { PasscodeItf } from "../../types/types";

type PasscodeLinkProps = {
    onClose: () => void;
    passCodeOnly?: boolean;
};

const PasscodeLink = ({ onClose, passCodeOnly = false }: PasscodeLinkProps) => {
    const [currentOption, setCurrentOption] = useState<"PASSCODE" | "LINK">(
        "PASSCODE"
    );
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { passcode, testLink } = useSelector(
        (state: RootState) => state.takeTest
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
                navigate(`/tests/${data.test_id}`);
                dispatch(takeTestActions.setIsPasscodeValidated(true));
                dispatch(takeTestActions.setIsEnteringPasscode(false));
                onClose();
            },
        });

    const handleClickNext = () => {
        if (currentOption === "PASSCODE") {
            checkPasscodeMutate();
        }
        if (currentOption === "LINK") {
        }
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
