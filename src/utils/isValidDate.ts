import { isDatePassed } from "./isDatePassed";
import { isToday } from "./isToday";

export function isValidDate(date: Date, closedDays: Date[]): boolean {
    if (isDatePassed(date) || isToday(date)) {
        return false;
    }
    for (const day of closedDays) {
        if (date.getTime() === day.getTime()) {
            return false
        }
    }
    return true;
}