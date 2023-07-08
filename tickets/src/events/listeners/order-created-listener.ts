import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@preeti097/common";

import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {}
}
