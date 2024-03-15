export interface INotificationService {
    send(userRef: string, message: string): Promise<void>
}