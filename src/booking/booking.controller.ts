import { Controller, Post, Body, Res } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingRequest } from 'src/models/booking-request.model';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}
    
    @Post()
    async book(@Body() booking: BookingRequest, @Res() response) {
        const resp = await this.bookingService.book(booking);
        if ('errorMessage' in resp) {
            return response.status(400).json(resp);
        }
        return response.json(resp);
    }
}
