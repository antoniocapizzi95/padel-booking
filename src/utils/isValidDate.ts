import { isDatePassed } from "./isDatePassed";
import { isToday } from "./isToday";

export function isValidDate(date: Date): boolean {
    if (isDatePassed(date) || isToday(date)) {
        return false;
    }

    const closedDays = process.env.CLOSED_DAYS.split(",").map(item => new Date(item.trim()));
    return closedDays.every(day => date.getTime() !== day.getTime());
}