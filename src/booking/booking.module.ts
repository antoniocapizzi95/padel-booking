import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { UserRepository } from 'src/repositories/mocks/user.repository';
import { BookingRepository } from '../repositories/mocks/booking.repository';

@Module({
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, UserRepository]
})
export class BookingModule {}
