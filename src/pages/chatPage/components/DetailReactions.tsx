import React, { useCallback, useEffect } from "react";
import InfoModal from "../../../components/modals/InfoModal";
import { ReactionEmoji } from "../../../types/chat";
import { MESSAGE_EMOJIS } from "../../../config/constants/chat";
import { useChatSocket } from "./ChatSocketContext";
import { userItf } from "../../../types/types";

type DetailReactionsProps = {
    onClose: () => void;
    emojiCounts: Record<string, number>;
    reactions: ReactionEmoji[];
};

const DetailReactions = ({
    emojiCounts,
    reactions,
    onClose,
}: DetailReactionsProps) => {
    const [selectedEmoji, setSelectedEmoji] = React.useState<string>(
        Object.keys(emojiCounts)[0]
    );
    const [reactorList, setReactorList] = React.useState<userItf[]>([]);
    const { currentChat } = useChatSocket();

    const getReactorList = useCallback(
        (emoji: string) => {
            return currentChat?.members
                .filter((member) => {
                    const reactionUserIds = reactions
                        .filter((reaction) => reaction.emoji === emoji)
                        .map((reaction) => reaction.user_id);
                    return reactionUserIds.includes(member.member.id);
                })
                .map((member) => member.member);
        },
        [currentChat, reactions]
    );

    useEffect(() => {
        setReactorList(getReactorList(selectedEmoji)!);
    }, [selectedEmoji, getReactorList]);

    return (
        <InfoModal title="Reactions" onClose={onClose}>
            <div className="flex gap-2">
                {Object.keys(emojiCounts).map((emoji) => {
                    const count = emojiCounts[emoji];
                    return (
                        <div
                            className={`flex items-center bg-gray-100 px-4 py-1 rounded-xl hover:bg-gray-200 cursor-pointer ${
                                selectedEmoji === emoji ? "bg-orange-200" : ""
                            }`}
                            key={emoji}
                            onClick={() => setSelectedEmoji(emoji)}
                        >
                            <span className="text-lg mr-1">
                                {MESSAGE_EMOJIS[emoji].icon}
                            </span>
                            <span className="text-lg text-gray-600 font-bold">
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 space-y-2">
                {reactorList.length > 0 &&
                    reactorList.map((reactor) => (
                        <div
                            className="flex gap-2 items-center"
                            key={reactor.id}
                        >
                            <img
                                className="w-7 h-7 object-cover rounded-full"
                                src={reactor.photo}
                                alt=""
                            />
                            <p>{reactor.name}</p>
                        </div>
                    ))}
            </div>
        </InfoModal>
    );
};

export default DetailReactions;
