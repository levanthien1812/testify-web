import React, { useState } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

type Props = {
    webcamVideoRef: React.RefObject<HTMLVideoElement>;
    screenVideoRef: React.RefObject<HTMLVideoElement>;
};

const Recorder = ({ webcamVideoRef, screenVideoRef }: Props) => {
    const { test } = useAppSelector((state) => state.takeTest);
    const [expanded, setExpanded] = useState(true);

    return (
        <div className={`${"fixed bottom-1 right-1"}`}>
            {expanded && (
                <div className="flex justify-end">
                    <button
                        className="text-gray-500 text-sm"
                        onClick={() => setExpanded(false)}
                    >
                        Hide
                    </button>
                </div>
            )}
            <div className="flex flex-col gap-2 bg-gray-50 border border-gray-300 p-2 rounded-md shadow-sm">
                {test && test.options.require_camera_on.enable && (
                    <div
                        className={`flex-1 aspect-video relative bg-black border border-orange-600 flex justify-center rounded-md ${
                            expanded ? "" : "hidden"
                        }`}
                    >
                        <p className="absolute top-1 right-1 bg-white opacity-70 rounded-full px-2 text-sm py-0 border border-gray-300">
                            Webcam preview
                        </p>
                        <video
                            ref={webcamVideoRef}
                            autoPlay
                            muted
                            playsInline
                            width={180}
                        />
                    </div>
                )}
                {test && test.options.require_screen_recorder.enable && (
                    <div
                        className={`flex-1 aspect-video relative bg-black border border-orange-600 flex justify-center rounded-md ${
                            expanded ? "" : "hidden"
                        }`}
                    >
                        <p className="absolute top-1 right-1 bg-white opacity-70 rounded-full px-2 text-sm py-0 border border-gray-300">
                            Screen preview
                        </p>
                        <video
                            ref={screenVideoRef}
                            autoPlay
                            muted
                            playsInline
                            width={180}
                        />
                    </div>
                )}
                {!expanded && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="text-gray-500 text-sm"
                    >
                        Show recorder
                        <FontAwesomeIcon
                            icon={faCamera}
                            className="ml-1 text-gray-500"
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Recorder;
