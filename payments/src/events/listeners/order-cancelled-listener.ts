import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from "@preeti097/common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findByEvent({
      id: data.id,
      version: data.version,
    });

    if (!order) {
      throw new Error("Order Not Found");
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    msg.ack();
  }
}
