import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("API can only be accessed if user is signed in", async () => {
  const orderId = new mongoose.Types.ObjectId();
  await request(app).get(`/api/orders/${orderId}`).send().expect(401);
});

it("Validation Error for Invalid OrderId", async () => {
    await request(app)
    .get(`/api/orders/1234`)
    .set("Cookie", global.signin())
    .send()
    .expect(400);

});

it("Get Order By Id for signed-in user", async () => {
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

  //fetch order of signin user #1
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signedinUser)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("Fails when one use tries to fetch order of another user", async () => {
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

  //signin user #2 fetches order of user #1
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
