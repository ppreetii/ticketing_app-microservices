import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "@preeti097/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

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
    ticket
  });
  await order.save();

  //create event data for expirayin:complete event for above order
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg , order, ticket};
};

it("Updates Order Status to cancelled when expiration:complete event is listened", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits OrderCancelled Event upon receiving ExpirationComplete event", async ()=>{
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);
    
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
})

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
