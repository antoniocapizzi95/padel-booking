import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingRequest } from '../models/booking-request.model';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../models/user.model';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}
    
    @Post()
    @UseGuards(AuthGuard)
    async book(@Body() booking: BookingRequest, @Req() request, @Res() response) {
        const user: User = request.user;
        const resp = await this.bookingService.book(booking, user);
        if ('errorMessage' in resp) {
            return response.status(400).json(resp);
        }
        return response.json(resp);
    }
}
