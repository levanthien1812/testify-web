import React, { useCallback, useMemo, useState } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "./Modal";
import Button from "../elements/Button";
import Input from "../elements/Input";

type PasscodeLinkProps = {
    onClose: () => void;
};

const PasscodeLink = ({ onClose }: PasscodeLinkProps) => {
    const [currentOption, setCurrentOption] = useState<"PASSCODE" | "LINK">(
        "PASSCODE"
    );

    const activeClass = useCallback(
        (option: "PASSCODE" | "LINK") => {
            return currentOption === option
                ? "bg-orange-600 text-white border border-orange-600"
                : "bg-gray-200 text-gray-500 border-none";
        },
        [currentOption]
    );

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Test passcode or link" />
            <ModalBody>
                <div className="flex w-full">
                    <Button
                        onClick={() => setCurrentOption("PASSCODE")}
                        className={`w-1/2 ${activeClass("PASSCODE")}`}
                    >
                        Passcode
                    </Button>
                    <Button
                        onClick={() => setCurrentOption("LINK")}
                        className={`w-1/2 ${activeClass("LINK")}`}
                    >
                        Link
                    </Button>
                </div>
                <div className="mt-2">
                    {currentOption === "PASSCODE" && (
                        <Input
                            placeholder="Enter passcode"
                            className="px-4 py-2 text-2xl text-center"
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
                <Button>Submit</Button>
            </ModalFooter>
        </Modal>
    );
};

export default PasscodeLink;
