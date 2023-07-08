import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("API can only be accessed if user is signed in", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app).post("/api/orders").send({ ticketId }).expect(401);
});

it("Validation error for invalid ticketId", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: "" })
    .expect(400);
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: "srcd2134bjdsnf" })
    .expect(400);
});

it("Returns error if ticket doesnot exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("Returns error if ticket is already reserved", async () => {
  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 120,
  });
  await ticket.save();

  //create order with above ticket, i.e, ticket is reserved now
  const order = Order.build({
    ticket,
    userId: "sddvb13327bhbdj",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  //create a new order for same ticket created above
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("Order is created successfully", async () => {
  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 120,
  });
  await ticket.save();

  //create order, above ticket is not reserved
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("Publish event on order creation", async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test ticket",
    price: 120,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled(); 
});