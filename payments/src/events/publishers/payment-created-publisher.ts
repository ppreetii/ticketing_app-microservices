import { Subjects, Publisher, PaymentCreatedEvent } from "@preeti097/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}