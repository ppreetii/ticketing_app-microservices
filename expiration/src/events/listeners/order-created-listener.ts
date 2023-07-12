import { Message } from "node-nats-streaming";
import { Subjects, OrderCreatedEvent, Listener } from "@preeti097/common";

import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); // delay in ms
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
  }
}
