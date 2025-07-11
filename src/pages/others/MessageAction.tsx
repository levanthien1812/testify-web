import React from "react";
import { useNavigate } from "react-router";
import Button from "../../components/elements/Button";

type Props = {
    message: {
        text: string;
        className?: string;
    };
    actions: {
        secondary?: {
            text: string;
            onClick: () => void;
        };
        primary: {
            text: string;
            onClick: () => void;
        };
    };
};

const MessageAction = ({ message, actions }: Props) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center py-8 px-8 mt-4">
            <p className="text-center text-xl">{message.text}</p>
            <div className="flex gap-2 mt-4">
                {actions.secondary && (
                    <Button secondary onClick={() => navigate(-1)} outlined>
                        {actions.secondary.text}
                    </Button>
                )}
                <Button primary onClick={() => navigate("/")}>
                    {actions.primary.text}
                </Button>
            </div>
        </div>
    );
};

export default MessageAction;
