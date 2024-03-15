import { INotificationService } from "./notification.service.interface";

export class SmsNotificationService implements INotificationService {

    async send(userRef: string, message: string): Promise<void> {
        console.log(`Sms sent to number ${userRef} with message: ${message}`);
    }
}