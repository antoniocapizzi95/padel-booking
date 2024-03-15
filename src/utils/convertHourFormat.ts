export function convertHourFormat(hour: number): string {
    if (hour === 0) {
        return '12am';
    } else if (hour === 12) {
        return '12pm';
    } else if (hour < 12) {
        return `${hour}am`;
    } else {
        return `${hour - 12}pm`;
    }
}