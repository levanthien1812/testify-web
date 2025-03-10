import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatSocket } from "../ChatSocketContext";
import { faFont, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SearchMessages from "./SearchMessages";
import SetNicknames from "./SetNicknames";

const ChatInfo = () => {
    const { cancelSearching } = useChatSocket();
    const [isSearchingMessages, setIsSearchingMessages] =
        useState<boolean>(false);
    const [isSettingNickNames, setIsSettingNickNames] =
        useState<boolean>(false);

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

    return (
        <div className="p-2 bg-white shadow-md h-full flex-[1]">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                <p className="text-2xl">Chat Info</p>
            </div>
            <div className="mt-2">
                {!isSearchingMessages && !isSettingNickNames && (
                    <div className="space-y-2">
                        <button
                            className="flex items-center hover:text-orange-600"
                            onClick={handleClickSearch}
                        >
                            <FontAwesomeIcon icon={faSearch} className=" w-6" />
                            <span className="ms-2">Search in chat</span>
                        </button>
                        <button
                            className="flex items-center hover:text-orange-600"
                            onClick={handleClickNickNames}
                        >
                            <FontAwesomeIcon icon={faFont} className=" w-6" />
                            <span className="ms-2">Set nicknames</span>
                        </button>
                    </div>
                )}
                {isSearchingMessages && (
                    <SearchMessages onClose={handleCloseSearching} />
                )}
                {isSettingNickNames && (
                    <SetNicknames onClose={handleCloseNicknames} />
                )}
            </div>
        </div>
    );
};

export default ChatInfo;
