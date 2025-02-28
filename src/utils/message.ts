export function isEmojiOnly(message: string) {
    if (!message) {
        return false; // Handle empty or null messages
    }

    // Unicode regex for emojis (covers a wide range)
    const emojiRegex =
        /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+(\s*(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))*$/;

    return emojiRegex.test(message);
}
