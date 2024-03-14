import { Slot } from "./slot.model";

export interface Booking {
    id?: number,
    slot: Slot,
    users: number[],
    confirmed: boolean
}