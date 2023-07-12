import { Subjects } from "../subjects";

export interface ExpirationCompleteEvent {
    subject: Subjects.ExpirationCompleted;
    data: {
        orderId: string;
    };
}