import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatSocket } from "../ChatSocketContext";
import {
    faFont,
    faPalette,
    faSearch,
    faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SearchMessages from "./SearchMessages";
import SetNicknames from "./SetNicknames";
import ChatAppearances from "./ChatAppearances";
import BlockChat from "./BlockChat";

const ChatInfo = () => {
    const { cancelSearching } = useChatSocket();
    const [isSearchingMessages, setIsSearchingMessages] =
        useState<boolean>(false);
    const [isSettingNickNames, setIsSettingNickNames] =
        useState<boolean>(false);
    const [isChatAppearances, setIsChatAppearances] = useState<boolean>(false);
    const [isBlockingChat, setIsBlockingChat] = useState<boolean>(false);

    const handleClickSearch = () => {
        setIsSearchingMessages(true);
    };

    const handleClickNickNames = () => {
        setIsSettingNickNames(true);
    };

    const handleCloseSearching = () => {
        setIsSearchingMessages(false);
        cancelSearching();
    };

    const handleCloseNicknames = () => {
        setIsSettingNickNames(false);
    };

    const handleClickChatAppearances = () => {
        setIsChatAppearances(true);
    };

    const handleCloseChatAppearances = () => {
        setIsChatAppearances(false);
    };

    return (
        <div className="p-2 bg-white shadow-md h-full flex-[1]">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                <p className="text-2xl">Chat Info</p>
            </div>
            <div className="mt-2">
                {!isSearchingMessages &&
                    !isSettingNickNames &&
                    !isChatAppearances &&
                    !isBlockingChat && (
                        <div className="space-y-2">
                            <button
                                className="flex items-center hover:text-orange-600"
                                onClick={handleClickSearch}
                            >
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className=" w-6"
                                />
                                <span className="ms-2">Search in chat</span>
                            </button>
                            <button
                                className="flex items-center hover:text-orange-600"
                                onClick={handleClickNickNames}
                            >
                                <FontAwesomeIcon
                                    icon={faFont}
                                    className=" w-6"
                                />
                                <span className="ms-2">Set nicknames</span>
                            </button>
                            <button
                                className="flex items-center hover:text-orange-600"
                                onClick={handleClickChatAppearances}
                            >
                                <FontAwesomeIcon
                                    icon={faPalette}
                                    className=" w-6"
                                />
                                <span className="ms-2">Chat appearances</span>
                            </button>
                            <button
                                className="flex items-center hover:text-orange-600"
                                onClick={() => setIsBlockingChat(true)}
                            >
                                <FontAwesomeIcon
                                    icon={faUserSlash}
                                    className=" w-6"
                                />
                                <span className="ms-2">Block chat</span>
                            </button>
                        </div>
                    )}
                {isSearchingMessages && (
                    <SearchMessages onClose={handleCloseSearching} />
                )}
                {isSettingNickNames && (
                    <SetNicknames onClose={handleCloseNicknames} />
                )}
                {isChatAppearances && (
                    <ChatAppearances onClose={handleCloseChatAppearances} />
                )}
                {isBlockingChat && (
                    <BlockChat onClose={() => setIsBlockingChat(false)} />
                )}
            </div>
        </div>
    );
};

export default ChatInfo;
