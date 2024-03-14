import { Controller, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingRequest } from 'src/models/booking-request.model';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}
    
    @Post()
    async book(@Body() booking: BookingRequest) {
        return this.bookingService.book(booking);
    }
}
