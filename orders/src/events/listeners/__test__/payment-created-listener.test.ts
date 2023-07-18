import mongoose from "mongoose";
import { PaymentCreatedEvent, OrderStatus } from "@preeti097/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { PaymentCreatedListener } from "../payment-created-listener"; 
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 10,
  });
  await ticket.save();

  //create order of above ticket
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "fssdcv",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  //create event data for expirayin:complete event for above order
  const data: PaymentCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
    stripeId: "fdcgavszdhscfkj"
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, ticket };
};

it("Updates Order Status to complete when payment:created event is listened", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
