import { Booking } from '../models/booking.model';

export interface IBookingRepository {
    getBookingByDateAndHour(date: Date, hour: number): Promise<Booking>;
    createBooking(booking: Booking): Promise<Booking>;
    updateBooking(id: number, editedBooking: Booking);
}