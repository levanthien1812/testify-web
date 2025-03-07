import { useEffect, useMemo, useState } from "react";
import { ReactionEmoji } from "../../../../types/chat";
import { MESSAGE_EMOJIS } from "../../../../config/constants/chat";
import DetailReactions from "./DetailReactions";

type ReactionsCountProps = {
    reactions: ReactionEmoji[];
};

const ReactionsCount = ({ reactions }: ReactionsCountProps) => {
    const [emojiCounts, setEmojiCounts] = useState<Record<string, number>>({});
    const [viewDetailCounts, setViewDetailCounts] = useState<boolean>(false);

    useEffect(() => {
        reactions.forEach((reaction) => {
            setEmojiCounts((prev) => ({
                ...prev,
                [reaction.emoji]: (prev[reaction.emoji] || 0) + 1,
            }));
        });

        return () => {
            setEmojiCounts({});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reactions]);

    const emojiCountsMapped = useMemo(() => {
        return Object.keys(emojiCounts).map((emoji) => {
            const count = emojiCounts[emoji];
            return (
                <div className="flex items-center" key={emoji}>
                    <span className="text-sm">
                        {MESSAGE_EMOJIS[emoji].icon}
                    </span>
                    <span className="text-xs text-gray-600 font-bold">
                        {count}
                    </span>
                </div>
            );
        });
    }, [emojiCounts]);

    const handleClick = () => {
        setViewDetailCounts(true);
    };

    return (
        <>
            <div
                className="absolute right-0 -bottom-5 bg-white border border-gray-100 rounded-lg px-0.5 flex gap-2 items-center cursor-pointer hover:bg-gray-100 z-20"
                onClick={handleClick}
            >
                {emojiCountsMapped}
            </div>

            {viewDetailCounts && (
                <DetailReactions
                    onClose={() => setViewDetailCounts(false)}
                    emojiCounts={emojiCounts}
                    reactions={reactions}
                />
            )}
        </>
    );
};

export default ReactionsCount;
