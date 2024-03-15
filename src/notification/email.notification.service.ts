import { INotificationService } from "./notification.service.interface";

export class EmailNotificationService implements INotificationService {

    async send(userRef: string, message: string): Promise<void> {
        console.log(`Email sent to address ${userRef} with message: ${message}`);
    }
}