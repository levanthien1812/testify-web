import React, { useState } from "react";
import { MessageItf } from "../../../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { formatImageUrl } from "../../../../utils/formatImageUrl";

type ImageProps = {
    message: MessageItf;
};

const Images = ({ message }: ImageProps) => {
    const [showAllImages, setShowAllImages] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const handleClickShowAll = () => {
        setShowAllImages(true);
    };

    return (
        <>
            <div
                className={`grid gap-x-1 gap-y-1 flex-wrap ${
                    message.sender_id === user!.id ? "" : ""
                }`}
                style={{
                    gridTemplateColumns: `repeat(${
                        message.images!.length > 3 ? 3 : message.images!.length
                    }, 80px)`,
                }}
            >
                {message
                    .images!.slice(
                        0,
                        showAllImages ? message.images!.length : 3
                    )
                    .map((img, i) => (
                        <div className="relative w-[80px] h-[80px]" key={i}>
                            <img
                                src={formatImageUrl(img)}
                                alt={`Preview ${i}`}
                                className="rounded-xl w-full h-full object-cover shadow-md"
                            />
                            {message.images! &&
                                message.images!.length > 3 &&
                                !showAllImages &&
                                i === 2 && (
                                    <button
                                        className="absolute border-none w-full h-full rounded-xl bg-black bg-opacity-60 text-white text-xl top-0 left-0"
                                        onClick={handleClickShowAll}
                                    >
                                        +{message.images!.length - 2}
                                    </button>
                                )}
                        </div>
                    ))}
            </div>
            {showAllImages && (
                <button
                    className="text-xs hover:underline hover:text-orange-600 text-gray-600"
                    onClick={() => setShowAllImages(false)}
                >
                    Hide
                </button>
            )}
        </>
    );
};

export default Images;
