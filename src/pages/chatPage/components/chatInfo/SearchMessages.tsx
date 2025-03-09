import React, { ChangeEvent, useEffect, useRef } from "react";
import Input from "../../../../components/elements/Input";
import { useChatSocket } from "../ChatSocketContext";
import { ChatItf } from "../../../../types/chat";
import Button from "../../../../components/elements/Button";

type SearchMessagesProps = {
    onClose: () => void;
};

const SearchMessages = ({ onClose }: SearchMessagesProps) => {
    const { currentChat, setCurrentChat, findSearchResult } = useChatSocket();
    const handleClickNext = () => {
        findSearchResult();
    };
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchStringChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrentChat({
            ...currentChat,
            search_string: e.target.value,
            search_result_no: 0,
        } as ChatItf);
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === "Enter" &&
            currentChat!.search_string &&
            currentChat!.search_string.trim().length > 0
        ) {
            handleClickNext();
        }
    };

    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.focus();
    }, []);

    return (
        <div>
            <p className="text-lg">Search messages in chats</p>
            <Input
                placeholder="Search in chat"
                sizing="sm"
                value={currentChat?.search_string}
                onChange={handleSearchStringChange}
                ref={inputRef}
                onKeyDown={handlePressEnter}
            />
            {currentChat?.search_result_no! > 0 && (
                <p className="text-sm text-right">
                    {currentChat?.search_result_no}/
                    {currentChat?.search_result_total} results found
                </p>
            )}
            <div className="flex gap-1 mt-1">
                <Button size="sm" onClick={handleClickNext}>
                    {currentChat?.search_result_no! > 1 ? "Find next" : "Find"}
                </Button>
                <Button size="sm" onClick={onClose} primary={false}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default SearchMessages;
