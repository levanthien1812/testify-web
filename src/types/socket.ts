import { MessageItf, ReactionEmoji } from "./chat";

export interface SendReaction {
    chat_id: string;
    message: Pick<MessageItf, "id" | "sender_id" | "text">;
    reactions: ReactionEmoji[];
    new_reaction: Pick<ReactionEmoji, "user" | "emoji">;
    type: "add" | "remove" | "change";
}
