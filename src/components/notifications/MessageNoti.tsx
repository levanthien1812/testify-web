import { UserItf } from "../../types/types";
import defaultUserPhoto from "../../assets/images/default-user-photo.png";
import { checkImageUrl } from "../../utils/image";
import { useEffect, useState } from "react";

const MessageNoti = ({
    sender,
    message,
}: {
    sender: Pick<UserItf, "name" | "photo">;
    message: string;
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
                        New Message from{" "}
                        <span className="font-bold">{sender.name}</span>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default MessageNoti;
