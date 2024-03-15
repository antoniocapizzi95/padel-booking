import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { SlotModule } from './slot/slot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    BookingModule,
    SlotModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
