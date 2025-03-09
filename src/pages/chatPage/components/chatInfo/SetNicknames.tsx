import { useChatSocket } from "../ChatSocketContext";
import Button from "../../../../components/elements/Button";
import Nickname from "./Nickname";

type SetNicknamesProps = {
    onClose: () => void;
};

const SetNicknames = ({ onClose }: SetNicknamesProps) => {
    const { currentChat: chat } = useChatSocket();

    return (
        <div>
            <p className="text-lg">Set nicknames</p>
            <div className="space-y-2 mt-2">
                {chat!.members.map((member) => {
                    return <Nickname member={member} key={member.member.id} />;
                })}
            </div>
            <div className="flex gap-1 mt-2">
                <Button size="sm" onClick={onClose} primary={false}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default SetNicknames;
