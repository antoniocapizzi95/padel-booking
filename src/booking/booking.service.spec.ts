import { BookingService } from './booking.service';
import { BookingRepository } from "../repositories/mocks/booking.repository";
import { UserRepository } from '../repositories/mocks/user.repository';
import { NotificationServiceFactory } from '../notification/notification.service.factory';

const { isValidDate } = require('../utils/isValidDate');

jest.mock('../repositories/mocks/booking.repository');
jest.mock('../repositories/mocks/user.repository');
jest.mock('../utils/isValidDate', () => ({ isValidDate: jest.fn() }));
jest.mock('../utils/getFormattedDate', () => ({ getFormattedDate: jest.fn() }));
jest.mock('../utils/convertHourFormat', () => ({ convertHourFormat: jest.fn() }));
jest.mock('../notification/notification.service.factory');

describe('BookingService', () => {
    let bookingService;
    let mockBookingRepository;
    let mockUserRepository;
    let mockNotificationServiceFactory;
    let mockNotificationService;

    beforeEach(() => {
        mockBookingRepository = new BookingRepository();
        mockUserRepository = new UserRepository();
        mockNotificationServiceFactory = new NotificationServiceFactory();
        mockNotificationService = { send: jest.fn() };
        mockNotificationServiceFactory.createNotificationService.mockReturnValue(mockNotificationService);
        bookingService = new BookingService(mockBookingRepository, mockUserRepository, mockNotificationServiceFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error for booking with an invalid date', async () => {
        const bookingReq = { slot: { date: 'invalid-date', hour: 10 } };
        const user = { id: 1, email: 'test@example.com' };
        isValidDate.mockReturnValue(false);
        const response = await bookingService.book(bookingReq, user);

        expect(response.errorMessage).toContain('No availability for this date:');
    });

    it('should throw an error for booking out of hours', async () => {
        const bookingReq = { slot: { date: '2024-03-20', hour: 8 } }; // Hour out of allowed range
        const user = { id: 1, email: 'test@example.com' };
        isValidDate.mockReturnValue(true);

        const response = await bookingService.book(bookingReq, user);
        expect(response.errorMessage).toBe('You are booking out of hours');
    });

    it('should throw an error when trying to book a slot the user has already booked', async () => {
        const bookingReq = { slot: { date: '2024-03-20', hour: 10 } };
        const user = { id: 1, username: 'testUser', email: 'test@example.com' };
        isValidDate.mockReturnValue(true);
        mockBookingRepository.getBookingByDateAndHour.mockResolvedValue({
            id: 'existing-booking',
            slot: bookingReq.slot,
            confirmed: false,
            users: [user.id]
        });
        const response = await bookingService.book(bookingReq, user);

        expect(response.errorMessage).toBe(`The user ${user.username} is already present in this booking`);
    });

    it('should handle a failure in sending notification correctly', async () => {
        const bookingReq = { slot: { date: '2024-03-20', hour: 10 } };
        const user = { id: 1, username: 'testUser', email: 'test@example.com' };
        isValidDate.mockReturnValue(true);
        mockBookingRepository.getBookingByDateAndHour.mockResolvedValue(null);
        mockBookingRepository.createBooking.mockResolvedValue({
            id: 'new-booking',
            slot: bookingReq.slot,
            confirmed: true, // Simulating a scenario that should trigger notification
            users: [user.id, 2, 3, 4] // MAX_PLAYERS_PER_SLOT reached
        });
        mockNotificationService.send.mockImplementation(() => {
            throw new Error('Failed to send notification');
        });

        const response = await bookingService.book(bookingReq, user);
        expect(response.confirmed).toBe(true);
    });
});