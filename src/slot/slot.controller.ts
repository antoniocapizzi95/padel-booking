import { Controller, Get, Query } from '@nestjs/common';
import { SlotService } from './slot.service';

@Controller('slot')
export class SlotController {
    constructor(private readonly slotService: SlotService) {}

    @Get()
    async getAvailableSlotsByDate(@Query('date') date: string) {
        return this.slotService.getAvailableSlotsByDate(date);
    }
}
