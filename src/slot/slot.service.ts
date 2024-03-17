import { Injectable } from '@nestjs/common';
import { Slot } from '../models/slot.model';
import { BookingRepository } from '../repositories/mocks/booking.repository';
import { AvailableSlotsResponse } from '../models/available-slots.response.model';
import { isValidDate } from '../utils/isValidDate';

@Injectable()
export class SlotService {
    constructor(private readonly bookingRepository: BookingRepository) {}

    async getAvailableSlotsByDate(date: string): Promise<AvailableSlotsResponse> {
        try {
            let selectedDate: Date = new Date();
            selectedDate.setDate(selectedDate.getDate() + 1 ); // set tomorrow by default
            if (date && date !== '') {
                selectedDate = new Date(date);
            }
            this.checkDate(selectedDate);
            const slots = this.generateSlotsByDate(selectedDate);
            const availableSlots = await this.filterAvailableSlot(slots);
            return { date: selectedDate, availableHours: availableSlots.map( slot => slot.hour) };
        } catch (error) {
            return { date: new Date(date), availableHours: [] }
        }
        
    }

    private generateSlotsByDate(date: Date): Slot[] {
        const slots: Slot[] = [];
        for (let i = 9; i < 23; i++) {
            slots.push({
                date,
                hour: i
            })
        }
        return slots
    }

    private async filterAvailableSlot(totalSlots: Slot[]): Promise<Slot[]> {
        const availableSlots: Slot[] = [];
        for (const slot of totalSlots) {
            const booking = await this.bookingRepository.getBookingByDateAndHour(slot.date, slot.hour);
            if (!booking || !booking.confirmed) {
                availableSlots.push(slot);
            }
        }
        return availableSlots;
    }

    private checkDate(date: Date) {
        if (!isValidDate(date)) {
            throw new Error(`No availability for this date: ${date}`)
        }
    }
}
