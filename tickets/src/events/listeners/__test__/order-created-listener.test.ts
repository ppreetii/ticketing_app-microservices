import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@preeti097/common";
import { Message } from "node-nats-streaming";

import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "test ticket",
    price: 99,
    userId: "dgzfvsdfbk",
  });
  await ticket.save();
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "ascdvbasdnb",
    expiresAt: "cdcvaksd",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {listener, ticket, data, msg}
};

it("Sets orderId of ticket", async ()=>{
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data,msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async() =>{
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})
