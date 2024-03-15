import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { UserRepository } from 'src/repositories/mocks/user.repository';
import { BookingRepository } from '../repositories/mocks/booking.repository';
import { NotificationServiceFactory } from '../notification/notification.service.factory';

@Module({
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, UserRepository, NotificationServiceFactory]
})
export class BookingModule {}
