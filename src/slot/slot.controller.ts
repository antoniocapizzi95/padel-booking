import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SlotService } from './slot.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('slot')
export class SlotController {
    constructor(private readonly slotService: SlotService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getAvailableSlotsByDate(@Query('date') date: string) {
        return this.slotService.getAvailableSlotsByDate(date);
    }
}
