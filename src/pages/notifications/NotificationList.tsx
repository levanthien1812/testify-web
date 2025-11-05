import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatSocket } from "../chatPage/components/ChatSocketContext";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { NotificationItf, ViewMode } from "../../types/socket";
import NotificationItem from "./NotificationItem";
import Loading from "../../components/loadings/Loading";
import {
    getNotifications,
    readAllNotifications,
} from "../../services/notification";
import { useMutation, useQuery } from "react-query";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../config/constants/queryMutationKeys";
import Popover from "../../components/modals/Popover";
import Button from "../../components/elements/Button";
import { useAppSelector } from "../../hooks/hooks";

const NotificationList = () => {
    const {
        notifications,
        filteredNotifications,
        setNotifications,
        setUnreadNotificationsCount,
        setFilteredNotifications,
    } = useChatSocket();
    const navigate = useNavigate();
    const notificationContainerRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<Record<string, HTMLDivElement | null>>({});
    const [lastOldestNotificationId, setLastOldestNotificationId] = useState<
        string | null
    >(null);
    const [viewMode, setViewMode] = useState<ViewMode>("all");
    const { user } = useAppSelector((state) => state.auth);

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

    const { mutate: readAllNotificationsMutate } = useMutation({
        mutationFn: async () => {
            await readAllNotifications();
        },
        mutationKey: MUTATION_KEYS.READ_ALL_NOTIFICATIONS,
        onSuccess: () => {
            setFilteredNotifications((prev) =>
                prev.map((noti) => ({ ...noti, is_read: true }))
            );
            setUnreadNotificationsCount(0);
        },
    });

    useEffect(() => {
        const lastNotification =
            notifications.length > 0
                ? notifications[notifications.length - 1]
                : null;

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

    const handleClickMarkAllAsRead = () => {
        readAllNotificationsMutate();
    };

    useEffect(() => {
        if (viewMode === "unread") {
            const unreadNotifications = notifications.filter(
                (noti) => !noti.read_by.includes(user!.id)
            );
            setFilteredNotifications(unreadNotifications);
        } else {
            setFilteredNotifications(notifications);
        }
    }, [viewMode, notifications]);

    return (
        <div className="p-2 bg-white shadow-md w-[300px]">
            <div className="flex justify-between items-center">
                <p className="text-xl">Notifications</p>
                <Popover
                    content={
                        <Button secondary onClick={handleClickMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    }
                >
                    <div className="`border-none bg-gray-100 rounded-full flex justify-center items-center hover:bg-gray-200 leading-none w-6 h-6">
                        <FontAwesomeIcon icon={faEllipsis} />
                    </div>
                </Popover>
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
                className="space-y-1 custom-scrollbar-y overflow-x-visible max-h-[40vh]"
                ref={notificationContainerRef}
            >
                {filteredNotifications &&
                    filteredNotifications.length > 0 &&
                    filteredNotifications.map((notification) => (
                        <NotificationItem
                            notification={notification}
                            key={notification.id}
                            ref={(el) => {
                                notificationsRef.current[notification.id] = el;
                            }}
                        />
                    ))}
                {!isLoadingNotifications &&
                    (!filteredNotifications ||
                        filteredNotifications.length === 0) && (
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
