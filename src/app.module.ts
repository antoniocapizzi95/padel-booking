import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { SlotModule } from './slot/slot.module';

@Module({
  imports: [BookingModule, SlotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
