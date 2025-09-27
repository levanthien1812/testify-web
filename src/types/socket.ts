import { MessageItf, ReactionEmoji } from "./chat";
import { UserItf } from "./types";

export interface SendReaction {
    chat_id: string;
    message: Pick<MessageItf, "id" | "sender_id" | "text">;
    reactions: ReactionEmoji[];
    new_reaction: Pick<ReactionEmoji, "user" | "emoji">;
    type: "add" | "remove" | "change";
}

export enum NOTIFICATION_TYPES {
    TEST_ASSIGNED = "test_assigned",
    TEST_PUBLISHED = "test_published",
    SUBMISSION_GRADED = "submission_graded",
    NEW_MESSAGE = "new_message",
    GROUP_ADDED = "group_added",
    GROUP_REMOVED = "group_removed",
    CHAT_REQUEST = "chat_request",
    CHAT_REQUEST_ACCEPTED = "chat_request_accepted",
    CHAT_REQUEST_REJECTED = "chat_request_rejected",
    OTHER = "other",
}

export interface NotificationItf {
    id: string;
    recipient_ids: string[];
    recipients: Pick<UserItf, "id" | "name" | "photo">[];
    sender_id?: string;
    sender?: Pick<UserItf, "id" | "name" | "photo">;
    type: NOTIFICATION_TYPES;
    message: string;
    link?: string;
    read_by: string[];
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface UnreadCounts {
    unread_messages_count: number;
    unread_notifications_count: number;
}
export type ViewMode = "all" | "unread";
