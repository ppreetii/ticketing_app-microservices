import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@preeti097/common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message){
      const order = Order.build({
        id: data.id,
        price: data.ticket.price,
        version: data.version,
        status: data.status,
        userId: data.userId
      });
      await order.save();

      msg.ack();
  }
}