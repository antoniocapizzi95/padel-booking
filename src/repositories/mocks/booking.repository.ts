import { Booking } from "../../models/booking.model";
import { IBookingRepository } from "../booking.repository.interface";
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class BookingRepository implements IBookingRepository {

    private filePath: string = 'bookings.json'; // File path for storing bookings

    constructor() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([])); // Create file if it doesn't exist
        }
    }

    private async readBookingsFromFile(): Promise<Booking[]> {
        let data = fs.readFileSync(this.filePath, 'utf-8');
        if (data === '') {
            data = '[]'
        }
        let dataParsed: Booking[] = JSON.parse(data);
        dataParsed.map(booking => { booking.slot.date = new Date(booking.slot.date) });
        return dataParsed;
    }

    private async writeBookingsToFile(bookings: Booking[]): Promise<void> {
        fs.writeFileSync(this.filePath, JSON.stringify(bookings, null, 2));
    }

    async getBookingByDateAndHour(date: Date, hour: number): Promise<Booking> {
        const bookings = await this.readBookingsFromFile();

        const booking = bookings.find(booking => booking.slot.date.getTime() === date.getTime() && booking.slot.hour === hour);
        return booking;
    }

    async createBooking(booking: Booking): Promise<Booking> {
        const bookings = await this.readBookingsFromFile();
        booking.id = await this.generateId();
        bookings.push(booking);
        await this.writeBookingsToFile(bookings);
        return booking;
    }

    async updateBooking(id: number, editedBooking: Booking) {
        const bookings = await this.readBookingsFromFile();
        const index = bookings.findIndex(booking => booking.id === id);
        if (index !== -1) {
            bookings[index] = editedBooking;
            await this.writeBookingsToFile(bookings);
            return
        }
        throw new Error(`Booking with id ${id} not found`);
    }

    private async generateId(): Promise<number> {
        const bookings = await this.readBookingsFromFile();
        return bookings.length + 1;
    }
}