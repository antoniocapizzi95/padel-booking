import { Injectable } from '@nestjs/common';
import { Booking } from '../models/booking.model';
import { BookingRepository } from '../repositories/mocks/booking.repository';
import { BookingRequest } from '../models/booking-request.model';
import { UserRepository } from '../repositories/mocks/user.repository';
import { User } from '../models/user.model';
import { isValidDate } from '../utils/isValidDate';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository, private readonly userRepository: UserRepository) {}
  
  async book(bookingReq: BookingRequest): Promise<Booking> {
    if (typeof bookingReq.slot.date === 'string') {
      bookingReq.slot.date = new Date(bookingReq.slot.date);
    }
    const booking = await this.bookingRepository.getBookingByDateAndHour(bookingReq.slot.date, bookingReq.slot.hour);
    await this.validateBookingReq(bookingReq, booking);
    if (booking) {
        booking.users.push(bookingReq.userId);
        if (booking.users.length === 4) {
            booking.confirmed = true;
            this.sendNotification(booking);
        }
        await this.bookingRepository.updateBooking(booking.id, booking);
        return booking
    }

    const newBooking = await this.bookingRepository.createBooking({
        slot: bookingReq.slot,
        confirmed: false,
        users: [bookingReq.userId]
    })

    return newBooking;
  }

  private async validateBookingReq(bookingReq: BookingRequest, booking: Booking) {
    if (bookingReq.slot.hour < 9 || bookingReq.slot.hour > 23) {
        throw new Error('You are booking out of hours');
    }

    if (isValidDate(bookingReq.slot.date, [])) {
      throw new Error(`No availability for this date: ${bookingReq.slot}`)
    }

    const user: User = await this.userRepository.findById(bookingReq.userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (booking && booking.confirmed) {
      throw new Error('Impossible to book in the selected slot');
    }

    if (booking && booking.users.includes(user.id)) {
      throw new Error(`The user ${user.username} is already present in this booking`);
    }

  }

  private async sendNotification(booking: Booking) {
    // TODO: send notification
  }
}