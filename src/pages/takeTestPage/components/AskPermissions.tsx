import React, { useMemo } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import Button from "../../../components/elements/Button";

type Props = {
    onClose: () => void;
    onAccept: () => void;
};

const AskPermissions = ({ onClose, onAccept }: Props) => {
    const { test } = useAppSelector((state) => state.takeTest);

    const message = useMemo(() => {
        if (!test) return;
        if (
            test.options.require_camera_on.enable &&
            test.options.require_screen_recorder.enable
        ) {
            return (
                <p>
                    🔒{" "}
                    <span className="font-bold text-orange-600">
                        Camera & Screen Sharing Required
                    </span>
                    <br />
                    For this test, you must enable both{" "}
                    <span className="font-bold text-orange-600">
                        camera
                    </span>{" "}
                    and{" "}
                    <span className="font-bold text-orange-600">
                        screen sharing
                    </span>
                    .<br />• Click{" "}
                    <span className="font-bold text-orange-600">Allow</span>{" "}
                    when the browser requests access to your camera.
                    <br />• Choose your screen or window to share, then click{" "}
                    <span className="font-bold text-orange-600">Share</span>.
                    <br />
                    This helps us maintain security and fairness during the
                    test.
                </p>
            );
        }
        if (test.options.require_camera_on.enable) {
            <p>
                📷{" "}
                <span className="font-bold text-orange-600">
                    Camera Permission Required
                </span>
                <br />
                To take this test, please allow access to your camera. This
                helps us verify your identity and maintain test integrity.
                <br />• Click{" "}
                <span className="font-bold text-orange-600">Allow</span> when
                prompted by your browser.
                <br />• Make sure your camera is working and uncovered.
            </p>;
        }
        if (test.options.require_screen_recorder.enable) {
            return (
                <p>
                    🖥️{" "}
                    <span className="font-bold text-orange-600">
                        Screen Sharing Permission Required
                    </span>
                    <br />
                    This test requires you to share your screen. This ensures a
                    fair testing environment.
                    <br />• When prompted, select your screen or window and
                    click{" "}
                    <span className="font-bold text-orange-600">Share</span>.
                    <br />• Close any sensitive or unrelated windows before
                    proceeding.
                </p>
            );
        }
    }, []);

    return (
        <Modal onClose={onClose} width="md:w-[400px]">
            <ModalHeader title="Ask for Permissions" />
            <ModalBody>{message}</ModalBody>
            <ModalFooter>
                <Button onClick={onAccept}>OK</Button>
            </ModalFooter>
        </Modal>
    );
};

export default AskPermissions;
