import { SlotService } from './slot.service';
import { BookingRepository } from '../repositories/mocks/booking.repository';

jest.mock('../repositories/mocks/booking.repository'); // Mock the booking repository
jest.mock('../utils/isValidDate', () => ({ isValidDate: jest.fn() })); // Mock isValidDate utility function

describe('SlotService', () => {
    let slotService;
    let mockBookingRepository;
    beforeEach(() => {
        mockBookingRepository = new BookingRepository();
        slotService = new SlotService(mockBookingRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all slots for a valid date with no bookings', async () => {
        const date = '2024-03-20';
        const isValidDate = require('../utils/isValidDate').isValidDate;
        isValidDate.mockReturnValue(true);
        mockBookingRepository.getBookingByDateAndHour.mockResolvedValue(null);

        const response = await slotService.getAvailableSlotsByDate(date);
        expect(response.availableHours.length).toBe(14); // from 9 to 22
        expect(isValidDate).toHaveBeenCalledWith(new Date(date));
    });

    it('should return some slots for a valid date with some bookings', async () => {
        const date = '2024-03-20';
        const isValidDate = require('../utils/isValidDate').isValidDate;
        isValidDate.mockReturnValue(true);
        mockBookingRepository.getBookingByDateAndHour.mockImplementation((date, hour) => {
            return hour === 10 || hour === 15 ? { confirmed: true } : null;
        });

        const response = await slotService.getAvailableSlotsByDate(date);
        expect(response.availableHours).not.toContain(10);
        expect(response.availableHours).not.toContain(15);
        expect(response.availableHours.length).toBe(12); // 14 total - 2 booked
    });

    it('should throw an error for an invalid date', async () => {
        const date = 'invalid-date';
        const isValidDate = require('../utils/isValidDate').isValidDate;
        isValidDate.mockReturnValue(false);
        const response = await slotService.getAvailableSlotsByDate(date);
        await expect(response.availableHours.length).toBe(0);
    });

    it('should return no slots for a valid date with all slots booked', async () => {
        const date = '2024-03-20';
        const isValidDate = require('../utils/isValidDate').isValidDate;
        isValidDate.mockReturnValue(true);
        mockBookingRepository.getBookingByDateAndHour.mockResolvedValue({ confirmed: true });

        const response = await slotService.getAvailableSlotsByDate(date);
        expect(response.availableHours.length).toBe(0);
    });

    it('should handle an error during slot filtering', async () => {
        const date = '2024-03-20';
        mockBookingRepository.getBookingByDateAndHour.mockRejectedValue(new Error('Data source error'));

        const response = await slotService.getAvailableSlotsByDate(date);
        expect(response.availableHours.length).toBe(0);
    });
});