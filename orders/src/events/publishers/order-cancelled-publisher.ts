import { Publisher, OrderCancelledEvent , Subjects } from "@preeti097/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
