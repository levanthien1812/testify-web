import moment from "moment-timezone";

export function formatTime(seconds: number) {
    seconds = Math.round(seconds);
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

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number = 2000
): T => {
    let timer: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(args);
        }, delay);
    }) as T;
};

export const getPeriodTimeFrom = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
};
