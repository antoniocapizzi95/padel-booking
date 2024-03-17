import { isDatePassed } from "./isDatePassed";
import { isToday } from "./isToday";

export function isValidDate(date: Date): boolean {
    if (isDatePassed(date) || isToday(date)) {
        return false;
    }

    const closedDays = process.env.CLOSED_DAYS.split(",").map(item => {
        const closedDay = new Date(item.trim());
        return new Date(Date.UTC(closedDay.getFullYear(), closedDay.getMonth(), closedDay.getDate()));
    });
    
    const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    return closedDays.every(day => !closedDays.find(closedDay => closedDay.getTime() === currentDate.getTime()));
}