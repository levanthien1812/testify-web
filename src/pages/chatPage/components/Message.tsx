import React, { useEffect, useRef, useState } from "react";
import { MessageItf } from "../../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { useChatSocket } from "./ChatSocketContext";
import { format } from "date-fns";

type MessageProps = {
    message: MessageItf;
    index: number;
};

const Message = ({ message, index }: MessageProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const { currentChat } = useChatSocket();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showAllImages, setShowAllImages] = useState(false);

    const handleClickShowAll = () => {
        setShowAllImages(true);
    };

    useEffect(() => {
        if (currentChat?.messages && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentChat]);

    return (
        <div
            key={message.id}
            className={`flex flex-col mb-1 ${
                message.sender_id === user!.id ? "items-end" : "items-start"
            }`}
            ref={scrollRef}
        >
            <div className="flex gap-1">
                {message.sender_id !== user!.id &&
                    (currentChat!.messages[index + 1]?.sender_id !==
                    message.sender_id ? (
                        <div className="relative w-4 h-4 rounded-full shadow-md">
                            <img
                                className=""
                                src={
                                    currentChat!.members.find(
                                        (member) =>
                                            member.member.id ===
                                            message.sender_id
                                    )?.member.photo
                                }
                                alt=""
                            />
                            <div className="absolute -right-0.5 -bottom-0.5 w-2 h-2 border border-white bg-green-500 rounded-full"></div>
                        </div>
                    ) : (
                        <div className="w-4 h-4"></div>
                    ))}
                <div>
                    <div
                        className={`flex flex-col ${
                            message.sender_id === user!.id
                                ? "items-end"
                                : "items-start"
                        }`}
                    >
                        {message.images && message.images.length > 0 && (
                            <div
                                className={`grid gap-x-1 gap-y-1 flex-wrap ${
                                    message.sender_id === user!.id ? "" : ""
                                }`}
                                style={{
                                    gridTemplateColumns: `repeat(${
                                        message.images.length > 3
                                            ? 3
                                            : message.images.length
                                    }, 80px)`,
                                }}
                            >
                                {message.images
                                    .slice(
                                        0,
                                        showAllImages
                                            ? message.images.length
                                            : 3
                                    )
                                    .map((img, i) => (
                                        <div
                                            className="relative w-[80px] h-[80px]"
                                            key={i}
                                        >
                                            <img
                                                src={img}
                                                alt={`Preview ${i}`}
                                                className="rounded-xl w-full h-full object-cover shadow-md"
                                            />
                                            {message.images.length > 3 &&
                                                !showAllImages &&
                                                i === 2 && (
                                                    <button
                                                        className="absolute border-none w-full h-full rounded-xl bg-black bg-opacity-60 text-white text-xl top-0 left-0"
                                                        onClick={
                                                            handleClickShowAll
                                                        }
                                                    >
                                                        +
                                                        {message.images.length -
                                                            3}
                                                    </button>
                                                )}
                                        </div>
                                    ))}
                            </div>
                        )}
                        {showAllImages && (
                            <button
                                className="text-xs hover:underline hover:text-orange-600 text-gray-600"
                                onClick={() => setShowAllImages(false)}
                            >
                                Hide
                            </button>
                        )}
                        {message.text.length > 0 && (
                            <div
                                className={`text-white rounded-full py-0.5 px-4 `}
                                style={{
                                    backgroundColor:
                                        currentChat!.appearances.messages_color,
                                }}
                            >
                                <p className="">{message.text}</p>
                            </div>
                        )}
                    </div>
                    {index === currentChat!.messages.length - 1 && (
                        <p
                            className={`leading-none text-xs mt-1 ${
                                message.sender_id === user!.id
                                    ? "text-end"
                                    : "text-start"
                            } text-gray-500`}
                        >
                            {format(new Date(message.created_at), "HH:mm:ss")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
