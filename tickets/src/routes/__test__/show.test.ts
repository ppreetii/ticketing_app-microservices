import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it('return 404 if ticket not found', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("Validation Error for Invalid TicketId", async () => {
  await request(app)
    .get(`/api/tickets/1234`)
    .set("Cookie", global.signin())
    .send()
    .expect(400);
});

it('return 200 with ticket information if ticket exists', async ()=>{
    const title = 'test', price = 10;
    const res =  await request(app)
       .post("/api/tickets")
       .set("Cookie", global.signin())
       .send({
         title,
         price,
       })
       .expect(201);

    const response = await request(app)
      .get(`/api/tickets/${res.body.id}`)
      .send()
      .expect(200);

    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
});
