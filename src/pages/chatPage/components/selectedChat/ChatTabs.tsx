import {
    faBoxArchive,
    faComments,
    faHands,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useChatSocket } from "../ChatSocketContext";
import { ChatTab } from "../../../../types/chat";
import { AnimatePresence, motion } from "framer-motion";

const ChatTabs = () => {
    const { currentTab, setCurrentTab } = useChatSocket();
    const [hoveredTab, setHoveredTab] = useState<ChatTab | null>(null);

    const activeButtonClasses = (tab: ChatTab) => {
        if (currentTab === tab) {
            return "bg-gray-50 px-2";
        } else {
            return "bg-white";
        }
    };

    const activeLabelClasses = (tab: ChatTab) => {
        if (currentTab === tab) {
            return "text-orange-600";
        } else {
            return "text-gray-500";
        }
    };

    const tabs = [
        {
            value: "chats",
            label: "Chats",
            icon: faComments,
        },
        {
            value: "requests",
            label: "Requests",
            icon: faHands,
        },
        {
            value: "archived",
            label: "Archived",
            icon: faBoxArchive,
        },
    ];

    return (
        <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((tab, index) => (
                <>
                    <button
                        className={`py-0.5 flex items-center ${activeButtonClasses(
                            tab.value as ChatTab
                        )}`}
                        key={tab.value}
                        onMouseEnter={() => setHoveredTab(tab.value as ChatTab)}
                        onMouseLeave={() => setHoveredTab(null)}
                        onClick={() => {
                            setCurrentTab(tab.value as ChatTab);
                        }}
                    >
                        <FontAwesomeIcon
                            className={`text-md ${activeLabelClasses(
                                tab.value as ChatTab
                            )} transition-all duration-150`}
                            icon={tab.icon}
                        />
                        <AnimatePresence>
                            {(currentTab === tab.value ||
                                hoveredTab === tab.value) && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`text-md font-bold ml-1 text-gray-500 overflow-hidden inline-block ${activeLabelClasses(
                                        tab.value as ChatTab
                                    )}`}
                                >
                                    {tab.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                    {index !== tabs.length - 1 && (
                        <span className="text-gray-300">|</span>
                    )}
                </>
            ))}
        </div>
    );
};

export default ChatTabs;
