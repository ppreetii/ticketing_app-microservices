import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("API can only be accessed if user is signed in", async () => {
  const orderId = new mongoose.Types.ObjectId();
  await request(app).delete(`/api/orders/${orderId}`).send().expect(401);
});

it("Validation Error for Invalid OrderId", async () => {
  await request(app)
    .get(`/api/orders/1234`)
    .set("Cookie", global.signin())
    .send()
    .expect(400);
});

it("Marks Order as Cancelled for signed-in user", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 123,
  });
  await ticket.save();

  //create an order for above ticket with signin user #1
  const signedinUser = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", signedinUser)
    .send({ ticketId: ticket.id })
    .expect(201);

  //cancel order of signin user #1
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", signedinUser)
    .send()
    .expect(204);

  //get order and check its status as cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Fails when one use tries to cancel order of another user", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 123,
  });
  await ticket.save();

  //create an order for above ticket with signin user #1
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  //signin user #2 cancels order of user #1
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("Emits event on order cancellation", async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 123,
  });
  await ticket.save();

  //create an order for above ticket with signin user #1
  const signedinUser = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", signedinUser)
    .send({ ticketId: ticket.id })
    .expect(201);

  //cancel order of signin user #1
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", signedinUser)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});