import { useChatSocket } from "../ChatSocketContext";
import Button from "../../../../components/elements/Button";
import Nickname from "./Nickname";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

type SetNicknamesProps = {
    onClose: () => void;
};

const SetNicknames = ({ onClose }: SetNicknamesProps) => {
    const { currentChat: chat } = useChatSocket();

    return (
        <div>
            <button
                className="text-gray-400 hover:text-gray-500 hover:underline flex items-center gap-1 text-sm"
                onClick={onClose}
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                Back
            </button>
            <p className="text-lg">Set nicknames</p>
            <div className="space-y-2 mt-2">
                {chat!.members.map((member) => {
                    return <Nickname member={member} key={member.member.id} />;
                })}
            </div>
        </div>
    );
};

export default SetNicknames;
