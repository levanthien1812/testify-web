import React from "react";
import { createPortal } from "react-dom";
import Backdrop from "../modals/Backdrop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronCircleLeft,
    faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

type ImagesViewerProps = {
    images: FileList | string[];
    onClose: () => void;
};

function isStringArray(value: any): value is string[] {
    return (
        Array.isArray(value) && value.every((item) => typeof item === "string")
    );
}

const ImagesViewer = ({ images, onClose }: ImagesViewerProps) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    return createPortal(
        <>
            <Backdrop onClose={onClose} />
            <div className="absolute top-0 left-0 bottom-0 right-0 m-auto w-fit h-1/2 flex justify-center items-center">
                {isStringArray(images) && (
                    <img
                        className="border-2 border-white-600 h-full"
                        src={images[currentIndex]}
                        alt={images[currentIndex]}
                    />
                )}
                {images instanceof FileList && (
                    <img
                        className="border-2 border-white-600 h-full"
                        src={URL.createObjectURL(images[currentIndex])}
                        alt={images[currentIndex].name}
                    />
                )}
                <button
                    className="absolute left-2 rounded-full overflow-hidden cursor-pointer disabled:cursor-default"
                    disabled={currentIndex === 0}
                >
                    <FontAwesomeIcon
                        icon={faChevronCircleLeft}
                        onClick={() =>
                            setCurrentIndex((prev) =>
                                prev > 0 ? prev - 1 : prev
                            )
                        }
                        className="text-white text-opacity-70 hover:text-opacity-100 text-xl"
                    />
                </button>
                <button
                    className="absolute right-2 rounded-full overflow-hidden cursor-pointer disabled:cursor-default"
                    disabled={currentIndex === images.length - 1}
                >
                    <FontAwesomeIcon
                        icon={faChevronCircleRight}
                        onClick={() =>
                            setCurrentIndex((prev) =>
                                prev < images.length - 1 ? prev + 1 : prev
                            )
                        }
                        className="text-white text-opacity-70 hover:text-opacity-100 text-xl"
                    />
                </button>
            </div>
        </>,
        document.getElementById("modal")!
    );
};

export default ImagesViewer;
