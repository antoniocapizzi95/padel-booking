import { Slot } from "./slot.model";

export interface BookingResponse {
    id?: number,
    slot: Slot,
    confirmed: boolean,
    missingPlayersToConfirm: number
}