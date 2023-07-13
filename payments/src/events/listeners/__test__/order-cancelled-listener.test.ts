import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@preeti097/common";
import { Message } from "node-nats-streaming";

import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
    status: OrderStatus.Created,
    userId: "xsscdhsd",
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "dcfcszvjbdn",
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Sets status of order to cancelled, so as to reject any incoming payment request for same order", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
