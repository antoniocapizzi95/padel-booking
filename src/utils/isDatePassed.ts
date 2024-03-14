export function isDatePassed (dateToCheck: Date): boolean {
    const currentDate = new Date();
    
    // Transforming dates to compare only the date part and not the time part
    const normalizedDateToCheck = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
    const normalizedCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    return normalizedDateToCheck < normalizedCurrentDate;
}