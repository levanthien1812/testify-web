import { ChatItf } from "../types/chat";
import { userItf } from "../types/types";

export const getChatName = (
    members: { member: userItf; nick_name: string | null }[],
    user: userItf
) => {
    let chatName: string = "";
    if (members.length >= 2) {
        if (members.length === 2) {
            const member = members.find(
                (member) => member.member.id !== user?.id
            );
            chatName = member!.nick_name || member!.member.name;
        }
        if (members.length > 2) {
            const memberNames = members
                .filter((member) => member.member.id !== user?.id)
                .map((member) => member.nick_name || member.member.name);
            if (memberNames.length === 2) {
                chatName = memberNames.join(" and ");
            } else {
                chatName = `${memberNames.slice(0, 2).join(", ")} and ${
                    memberNames.length - 2
                } others"`;
            }
        }
    }

    return chatName;
};
