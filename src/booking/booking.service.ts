import { Injectable } from '@nestjs/common';
import { Booking } from '../models/booking.model';
import { BookingRepository } from '../repositories/mocks/booking.repository';
import { BookingRequest } from '../models/booking-request.model';
import { UserRepository } from '../repositories/mocks/user.repository';
import { User } from '../models/user.model';
import { isValidDate } from '../utils/isValidDate';
import { NotificationServiceFactory } from '../notification/notification.service.factory';
import { INotificationService } from '../notification/notification.service.interface';
import { ResponseError } from 'src/models/response-error.model';
import { getFormattedDate } from '../utils/getFormattedDate';
import { convertHourFormat } from '../utils/convertHourFormat';
import { BookingResponse } from '../models/booking-response.model';

const MAX_PLAYERS_PER_SLOT = 4
@Injectable()
export class BookingService {

  private readonly notificationService: INotificationService

  constructor(
      private readonly bookingRepository: BookingRepository,
      private readonly userRepository: UserRepository,
      private readonly notificationServiceFactory: NotificationServiceFactory
     ) {
      this.notificationService = this.notificationServiceFactory.createNotificationService('email');
     }
  
  async book(bookingReq: BookingRequest, user: User): Promise<BookingResponse | ResponseError> {
    try {
      if (typeof bookingReq.slot.date === 'string') {
        bookingReq.slot.date = new Date(bookingReq.slot.date);
      }
      const booking = await this.bookingRepository.getBookingByDateAndHour(bookingReq.slot.date, bookingReq.slot.hour);
      await this.validateBookingReq(bookingReq, booking, user);
      if (booking) {
          booking.users.push(user.id);
          const players = booking.users.length;
          if (players === MAX_PLAYERS_PER_SLOT) {
              booking.confirmed = true;
              this.sendNotification(booking);
          }
          await this.bookingRepository.updateBooking(booking.id, booking);
          return { id: booking.id, slot: booking.slot, confirmed: booking.confirmed, missingPlayersToConfirm: MAX_PLAYERS_PER_SLOT - players};
      }
  
      const newBooking = await this.bookingRepository.createBooking({
          slot: bookingReq.slot,
          confirmed: false,
          users: [user.id]
      })
  
      return { id: newBooking.id, slot: newBooking.slot, confirmed: newBooking.confirmed, missingPlayersToConfirm: MAX_PLAYERS_PER_SLOT - newBooking.users.length };
    } catch(error) {
      return { errorMessage: error.message }
    }
  }

  private async validateBookingReq(bookingReq: BookingRequest, booking: Booking, user: User) {
    if (bookingReq.slot.hour < 9 || bookingReq.slot.hour > 23) {
        throw new Error('You are booking out of hours');
    }

    if (!isValidDate(bookingReq.slot.date)) {
      throw new Error(`No availability for this date: ${bookingReq.slot}`)
    }

    if (booking && booking.confirmed) {
      throw new Error('Impossible to book in the selected slot');
    }

    if (booking && booking.users.includes(user.id)) {
      throw new Error(`The user ${user.username} is already present in this booking`);
    }

  }

  private async sendNotification(booking: Booking) {
    for (const userId of booking.users) {
      const user = await this.userRepository.findById(userId);
      this.notificationService.send(user.email, `Your booking for the day ${getFormattedDate(booking.slot.date)} at ${convertHourFormat(booking.slot.hour)} is confirmed`);
    }
  }
}