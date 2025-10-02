import React, { forwardRef } from "react";
import { NotificationItf } from "../../types/socket";
import { formatImageUrl } from "../../utils/formatImageUrl";
import { getPeriodTimeFrom } from "../../utils/time";
import HtmlDisplay from "../../components/elements/HtmlDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "../../components/modals/Popover";
import Button from "../../components/elements/Button";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useMutation } from "react-query";
import {
    deleteNotification,
    readNotification,
} from "../../services/notification";

type Props = {
    notification: NotificationItf;
};

const NotificationItem = forwardRef<HTMLDivElement, Props>(
    ({ notification }: Props, ref) => {
        const [isHovering, setIsHovering] = React.useState(false);
        const navigate = useNavigate();

        const {
            mutate: deleteNotificationMutate,
            isLoading: isDeletingNotification,
        } = useMutation({
            mutationFn: async () => {
                const responseData = await deleteNotification(notification.id);
                return responseData;
            },
            onSuccess: () => {
                console.log("Notification deleted successfully");
            },
        });

        const {
            mutate: markNotificationAsReadMutate,
            isLoading: isMarkingNotificationAsRead,
        } = useMutation({
            mutationFn: async () => {
                const responseData = await readNotification(notification.id);
                return responseData;
            },
            onSuccess: () => {
                console.log("Notification marked as read successfully");
            },
        });

        const handleClickDelete = () => {
            deleteNotificationMutate();
        };

        const handleClickHide = () => {};

        const handleClickMarkAsRead = () => {
            markNotificationAsReadMutate();
        };

        const handleClickNotification = () => {
            if (notification.link) {
                navigate(notification.link);
            }
        };

        return (
            <div
                className="flex gap-2 bg-white p-2 items-center shadow-md cursor-pointer hover:bg-orange-100"
                key={notification.id}
                onClick={handleClickNotification}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                ref={ref}
            >
                <div className="shrink-0">
                    <img
                        className="w-7 h-7 rounded-full mx-auto object-cover"
                        src={formatImageUrl(notification.sender?.photo)}
                        alt=""
                    />
                </div>
                <div className="grow">
                    <HtmlDisplay
                        htmlContent={notification.message}
                        className=""
                    />
                    <div className="text-orange-600 text-sm font-bold">
                        {getPeriodTimeFrom(new Date(notification.created_at))}
                    </div>
                </div>
                {isHovering && (
                    <Popover
                        content={
                            <div className="px-1 py-1 flex flex-col gap-1 bg-white bg-opacity-45">
                                <Button className="" secondary size="sm">
                                    Mark as read
                                </Button>
                                <Button className="" secondary size="sm">
                                    Delete
                                </Button>
                                <Button className="" secondary size="sm">
                                    Hide
                                </Button>
                            </div>
                        }
                        position="bottom-right"
                    >
                        <FontAwesomeIcon icon={faEllipsis} />
                    </Popover>
                )}
            </div>
        );
    }
);

export default NotificationItem;
