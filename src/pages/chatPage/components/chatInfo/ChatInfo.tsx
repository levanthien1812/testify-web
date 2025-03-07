import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../../../components/elements/Input";
import { useChatSocket } from "../ChatSocketContext";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SearchMessages from "./SearchMessages";

const ChatInfo = () => {
    const { currentChat } = useChatSocket();
    const [isSearchingMessages, setIsSearchingMessages] =
        useState<boolean>(false);

    const handleClickSearch = () => {
        setIsSearchingMessages(true);
    };

    return (
        <div className="p-2 bg-white shadow-md w-1/3">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                <p className="text-2xl">Chat Info</p>
            </div>
            <div className="mt-2">
                <button
                    className="flex items-center hover:text-orange-600"
                    onClick={handleClickSearch}
                >
                    <FontAwesomeIcon icon={faSearch} />
                    <span className="ms-2">Search in chat</span>
                </button>
            </div>
            {isSearchingMessages && <SearchMessages />}
        </div>
    );
};

export default ChatInfo;
