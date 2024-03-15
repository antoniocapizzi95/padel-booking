import { Injectable } from "@nestjs/common";
import { INotificationService } from "./notification.service.interface";
import { EmailNotificationService } from "./email.notification.service";
import { SmsNotificationService } from "./sms.notification.service";

@Injectable()
export class NotificationServiceFactory {
    createNotificationService(service: string): INotificationService {
        if (service === 'email') {
            return new EmailNotificationService();
        }
        if (service === 'sms') {
            return new SmsNotificationService();
        }
        // If in future will be some additional notification service, it can be added here
        throw new Error('Service not supported');
    }
}