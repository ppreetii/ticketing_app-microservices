import { Publisher,OrderCreatedEvent, Subjects } from "@preeti097/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}