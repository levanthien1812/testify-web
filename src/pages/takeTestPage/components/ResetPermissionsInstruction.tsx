import React from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import Button from "../../../components/elements/Button";

type Props = {
    onClose: () => void;
};

const ResetPermissionsInstruction = ({ onClose }: Props) => {
    // detect browser
    const ua = navigator.userAgent.toLowerCase();
    let browser = "your browser";
    if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("safari") && !ua.includes("chrome"))
        browser = "Safari";
    else if (ua.includes("edg")) browser = "Edge";

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Reset Permissions Instructions" />
            <ModalBody>
                <div>
                    <p className="mb-2">
                        It looks like{" "}
                        <span className="font-bold">
                            camera or screen permissions
                        </span>{" "}
                        were blocked. Please reset them in{" "}
                        <span className="font-bold text-orange-600">
                            {browser}
                        </span>
                        .
                    </p>

                    {browser === "Chrome" && (
                        <ul className="list-disc pl-6 mb-4 text-sm">
                            <li>
                                Click the{" "}
                                <span className="font-bold">🔒 lock icon</span>{" "}
                                in the address bar
                            </li>
                            <li>
                                Select{" "}
                                <span className="font-bold">Site settings</span>
                            </li>
                            <li>
                                Under <span className="font-bold">Camera</span>{" "}
                                or <span className="font-bold">Microphone</span>
                                , choose{" "}
                                <span className="font-bold">Allow</span>
                            </li>
                            <li>Refresh the page</li>
                        </ul>
                    )}

                    {browser === "Firefox" && (
                        <ul className="list-disc pl-6 mb-4 text-sm">
                            <li>
                                Click the{" "}
                                <span className="font-bold">
                                    camera/mic icon
                                </span>{" "}
                                in the address bar
                            </li>
                            <li>
                                Select{" "}
                                <span className="font-bold">
                                    Clear this permission
                                </span>
                            </li>
                            <li>Reload the page</li>
                        </ul>
                    )}

                    {browser === "Safari" && (
                        <ul className="list-disc pl-6 mb-4 text-sm">
                            <li>
                                Go to{" "}
                                <span className="font-bold">
                                    Safari &gt; Preferences &gt; Websites
                                </span>
                            </li>
                            <li>
                                Find <span className="font-bold">Camera</span>{" "}
                                or <span className="font-bold">Microphone</span>
                            </li>
                            <li>
                                Change access for this site to{" "}
                                <span className="font-bold">Allow</span>
                            </li>
                            <li>Reload the page</li>
                        </ul>
                    )}

                    {browser === "Edge" && (
                        <ul className="list-disc pl-6 mb-4 text-sm">
                            <li>
                                Click the{" "}
                                <span className="font-bold">🔒 lock icon</span>{" "}
                                in the address bar
                            </li>
                            <li>
                                Select{" "}
                                <span className="font-bold">
                                    Permissions for this site
                                </span>
                            </li>
                            <li>
                                Set <span className="font-bold">Camera</span> or{" "}
                                <span className="font-bold">Microphone</span> to{" "}
                                <span className="font-bold">Allow</span>
                            </li>
                            <li>Refresh the page</li>
                        </ul>
                    )}
                </div>
            </ModalBody>
            <ModalFooter includeCancelBtn={false}>
                <Button onClick={onClose}>Got it!</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ResetPermissionsInstruction;
