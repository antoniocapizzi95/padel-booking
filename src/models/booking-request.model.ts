import { Slot } from "./slot.model";

export interface BookingRequest {
    slot: Slot,
    userId: number
}