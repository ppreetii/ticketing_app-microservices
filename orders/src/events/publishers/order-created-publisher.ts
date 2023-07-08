import { Publisher,OrderCreatedEvent, Subjects } from "@preeti097/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}