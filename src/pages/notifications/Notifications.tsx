import Popover from "../../components/modals/Popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatSocket } from "../chatPage/components/ChatSocketContext";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import NotificationList from "./NotificationList";

const Notifications = () => {
    const { unreadNotificationsCount } = useChatSocket();

    return (
        <Popover
            children={
                <div className="relative cursor-pointer">
                    <FontAwesomeIcon
                        icon={faBell}
                        className="text-2xl text-gray-500 hover:text-orange-600 transition-all duration-150"
                    />
                    {unreadNotificationsCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full flex items-center justify-center px-1 leading-none">
                            {unreadNotificationsCount}
                        </div>
                    )}
                </div>
            }
            content={<NotificationList />}
        />
    );
};

export default Notifications;
