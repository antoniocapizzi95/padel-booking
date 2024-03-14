import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { BookingRepository } from '../repositories/mocks/booking.repository';

@Module({
  controllers: [SlotController],
  providers: [SlotService, BookingRepository]
})
export class SlotModule {}
