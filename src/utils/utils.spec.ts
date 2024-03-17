import { convertHourFormat } from "./convertHourFormat";
import { getFormattedDate } from "./getFormattedDate";
import { isDatePassed } from "./isDatePassed";
import { isToday } from "./isToday";
import { isValidDate } from "./isValidDate";

describe('convertHourFormat', () => {
    test('converting hours to correct format', () => {
        expect(convertHourFormat(0)).toBe('12am');
        expect(convertHourFormat(12)).toBe('12pm');
        expect(convertHourFormat(5)).toBe('5am');
        expect(convertHourFormat(18)).toBe('6pm');
    });
});

describe('getFormattedDate', () => {
    test('formatting date correctly', () => {
        const date = new Date('2022-03-15');
        expect(getFormattedDate(date)).toBe('2022-03-15');
    });
});

describe('isDatePassed', () => {
    test('checking if date is passed', () => {
        const pastDate = new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)); // 2 days ago
        const futureDate = new Date(new Date().getTime() + (2 * 24 * 60 * 60 * 1000)); // two days from now

        expect(isDatePassed(pastDate)).toBe(true);
        expect(isDatePassed(futureDate)).toBe(false);
    });
});

describe('isToday', () => {
    test('checking if date is today', () => {
        const today = new Date();
        
        expect(isToday(today)).toBe(true);
    });
});

describe('isValidDate', () => {
    test('checking if date is valid', () => {
        const twoDaysFromNow = new Date(new Date().getTime() + (2 * 24 * 60 * 60 * 1000)); // just to get a random valid date
        const threeDaysFromNow = new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000));
        
        process.env.CLOSED_DAYS = getFormattedDate(twoDaysFromNow);

        expect(isValidDate(twoDaysFromNow)).toBe(false);

        expect(isValidDate(threeDaysFromNow)).toBe(true);
    });
});