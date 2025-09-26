import React, { useMemo } from "react";
import Popover from "../../components/modals/Popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatSocket } from "../chatPage/components/ChatSocketContext";
import { useAppSelector } from "../../hooks/hooks";
import { faBell, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { formatImageUrl } from "../../utils/formatImageUrl";
import { useNavigate } from "react-router";
import { NotificationItf } from "../../types/socket";

const Notifications = () => {
    const { notifications } = useChatSocket();
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const unreadNotifications = useMemo(() => {
        if (!notifications) return [];
        return notifications.filter(
            (notification) => notification.read_by.includes(user!.id) === false
        );
    }, [notifications, user]);

    const handleClickNotification = (notification: NotificationItf) => {
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <Popover
            children={
                <div className="relative cursor-pointer">
                    <FontAwesomeIcon
                        icon={faBell}
                        className="text-2xl text-gray-500 hover:text-orange-600 transition-all duration-150"
                    />
                    {unreadNotifications.length > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full flex items-center justify-center px-1 leading-none">
                            {unreadNotifications.length}
                        </div>
                    )}
                </div>
            }
            content={
                <div className="p-2 bg-white shadow-md w-[300px]">
                    <div className="flex justify-between items-center">
                        <p className="text-xl">Notifications</p>
                        <div className="`border-none bg-gray-100 rounded-full flex justify-center items-center hover:bg-gray-200 leading-none w-6 h-6">
                            <FontAwesomeIcon icon={faEllipsis} />
                        </div>
                    </div>
                    <hr className="my-2" />
                    <div className="space-y-1">
                        {notifications &&
                            notifications.length > 0 &&
                            notifications.map((notification) => (
                                <div
                                    className="flex gap-2 bg-white p-2 items-center shadow-md cursor-pointer hover:bg-orange-100"
                                    key={notification.id}
                                    onClick={() =>
                                        handleClickNotification(notification)
                                    }
                                >
                                    <div className="shrink-0">
                                        <img
                                            className="w-7 h-7 rounded-full mx-auto object-cover"
                                            src={formatImageUrl(
                                                notification.sender?.photo
                                            )}
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        {notification.sender && (
                                            <div>
                                                {notification.sender.name}
                                            </div>
                                        )}
                                        <div>{notification.message}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            }
        />
    );
};

export default Notifications;
