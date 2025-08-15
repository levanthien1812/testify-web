import { UserItf } from "../../types/types";

const MessageNoti = ({
    sender,
    message,
}: {
    sender: Pick<UserItf, "name" | "photo">;
    message: string;
}) => {
    return (
        <div className="flex flex-col p-4 rounded-lg bg-white shadow-lg border border-gray-200 w-full max-w-sm">
            <div className="flex items-center">
                <img
                    src={sender.photo}
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
