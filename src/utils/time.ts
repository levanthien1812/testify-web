import moment from "moment-timezone";

export function formatTime(seconds: number) {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format the time string
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

    return formattedTime;
}

export function formatTimezone(date: Date) {
    const formattedDateTime = moment(date)
        .tz("Asia/Ho_Chi_Minh") // Set the timezone
        .format("YYYY-MM-DDTHH:mm");

    return formattedDateTime;
}
