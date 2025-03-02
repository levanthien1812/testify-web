import React from "react";
import { MESSAGE_EMOJIS } from "../../../config/constants/chat";
import { AnimatePresence, motion } from "framer-motion";

type EmojiReactionProps = {
    onEmojiClick: (emoji: string) => void;
    selectedEmoji: string | undefined;
};

const EmojiReaction = ({ onEmojiClick, selectedEmoji }: EmojiReactionProps) => {
    const handleClickEmoji = (emojiCode: string) => {
        onEmojiClick(emojiCode);
    };

    return (
        <div className="absolute -top-7 right-0 flex gap-1 bg-gray-100 rounded-xl p-0.5 shadow-md items-end">
            <AnimatePresence>
                {Object.keys(MESSAGE_EMOJIS).map((emoji, index) => (
                    <motion.button
                        className={`w-6 h-6 flex items-center justify-center text-center ${
                            selectedEmoji === emoji
                                ? "bg-orange-200 rounded-lg"
                                : ""
                        }`}
                        key={emoji}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        whileHover={{
                            scale: 1.3,
                        }}
                        onClick={() => handleClickEmoji(emoji)}
                    >
                        {MESSAGE_EMOJIS[emoji].icon}
                    </motion.button>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default EmojiReaction;
