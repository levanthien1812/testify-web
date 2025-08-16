import { UserItf } from "../../types/types";
import defaultUserPhoto from "../../assets/images/default-user-photo.png";
import { checkImageUrl } from "../../utils/image";
import { useEffect, useState } from "react";
import { MESSAGE_EMOJIS } from "../../config/constants/chat";
import { shorten } from "../../utils/text";

const ReactionNoti = ({
    sender,
    emoji,
    type,
    message,
}: {
    emoji: string;
    message: string;
    sender: Pick<UserItf, "name" | "photo">;
    type: "add" | "change";
}) => {
    const [validUrl, setValidUrl] = useState(false);

    useEffect(() => {
        const checkUrl = async () => {
            const isValid = (await checkImageUrl(sender.photo)) as boolean;
            setValidUrl(isValid);
        };
        checkUrl();
    }, [sender.photo, setValidUrl]);

    return (
        <div className="flex flex-col w-full max-w-sm">
            <div className="flex items-center">
                <img
                    src={validUrl ? sender.photo : defaultUserPhoto}
                    alt="sender"
                    className="w-[32px] h-[32px] object-cover rounded-full shadow-md"
                />
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        <span className="font-bold">{sender.name}</span>{" "}
                        {type === "add"
                            ? "has reacted to your message with"
                            : "has changed reaction to"}{" "}
                        {MESSAGE_EMOJIS[emoji].icon}
                    </p>
                    <p className="text-sm text-gray-500">
                        Message: {shorten(message)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReactionNoti;
