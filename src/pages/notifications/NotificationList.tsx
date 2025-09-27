import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatSocket } from "../chatPage/components/ChatSocketContext";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { NotificationItf, ViewMode } from "../../types/socket";
import NotificationItem from "./NotificationItem";
import Loading from "../../components/loadings/Loading";
import { getNotifications } from "../../services/notification";
import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";

const NotificationList = () => {
    const { notifications, setNotifications } = useChatSocket();
    const navigate = useNavigate();
    const notificationContainerRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<Record<string, HTMLDivElement | null>>({});
    const [lastOldestNotificationId, setLastOldestNotificationId] = useState<
        string | null
    >(null);
    const [viewMode, setViewMode] = useState<ViewMode>("all");

    const { isLoading: isLoadingNotifications, refetch: refetchNotifications } =
        useQuery<NotificationItf[]>({
            queryFn: async () => {
                const responseData = await getNotifications({
                    oldestNotificationId:
                        notifications && notifications.length > 0
                            ? notifications[notifications.length - 1].id
                            : undefined,
                });
                return responseData.notifications;
            },
            queryKey: [QUERY_KEYS.GET_NOTIFICATIONS],
            onSuccess: (notis) => {
                if (notis.length > 0) {
                    if (notifications.includes(notis[0])) return;
                }
                setNotifications((prev) => [...prev, ...notis]);
            },
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        });

    const handleClickNotification = (notification: NotificationItf) => {
        if (notification.link) {
            navigate(notification.link);
        }
    };

    useEffect(() => {
        const lastNotification =
            notifications.length > 0
                ? notifications[notifications.length - 1]
                : null;

        console.log(lastNotification, lastOldestNotificationId);

        if (!lastNotification) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    lastNotification.id !== lastOldestNotificationId
                ) {
                    // observer.unobserve(entries[0].target);
                    refetchNotifications();
                    setLastOldestNotificationId(lastNotification.id);
                }
            },
            {
                threshold: 1,
            }
        );

        if (lastNotification && notificationsRef.current[lastNotification.id]) {
            observer.observe(notificationsRef.current[lastNotification.id]!);
        }

        return () => {
            observer.disconnect();
        };
    }, [notifications, lastOldestNotificationId, refetchNotifications]);

    return (
        <div className="p-2 bg-white shadow-md w-[300px]">
            <div className="flex justify-between items-center">
                <p className="text-xl">Notifications</p>
                <div className="`border-none bg-gray-100 rounded-full flex justify-center items-center hover:bg-gray-200 leading-none w-6 h-6">
                    <FontAwesomeIcon icon={faEllipsis} />
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    className={`border-none bg-transparent text-gray-400 ${
                        viewMode === "all"
                            ? "text-orange-600 font-bold hover:text-orange-600"
                            : ""
                    } hover:text-gray-600`}
                    onClick={() => setViewMode("all")}
                >
                    All
                </button>
                <button
                    className={`border-none bg-transparent text-gray-400 ${
                        viewMode === "unread"
                            ? "text-orange-600 font-bold hover:text-orange-600"
                            : ""
                    } hover:text-gray-600`}
                    onClick={() => setViewMode("unread")}
                >
                    Unread
                </button>
            </div>
            <hr className="my-2" />
            <div
                className="space-y-1 custom-scrollbar-y max-h-[30vh]"
                ref={notificationContainerRef}
            >
                {notifications &&
                    notifications.length > 0 &&
                    notifications.map((notification) => (
                        <NotificationItem
                            notification={notification}
                            onClick={handleClickNotification}
                            key={notification.id}
                            ref={(el) => {
                                notificationsRef.current[notification.id] = el;
                            }}
                        />
                    ))}
                {!isLoadingNotifications &&
                    (!notifications || notifications.length === 0) && (
                        <div className="text-center text-gray-500 text-xl">
                            No notifications
                        </div>
                    )}
                <Loading
                    isLoading={isLoadingNotifications}
                    loadingText={{ text: "Loading notifications..." }}
                />
            </div>
        </div>
    );
};

export default NotificationList;
