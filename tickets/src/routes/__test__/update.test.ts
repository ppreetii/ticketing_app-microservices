import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("Returns 404 if ticket doesnot exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 10,
    })
    .expect(404);
});
it("Returns 401 if user is not authenticated", async () => {
     const id = new mongoose.Types.ObjectId().toHexString();
     await request(app)
       .put(`/api/tickets/${id}`)
       .send({
         title: "test",
         price: 10,
       })
       .expect(401);
});
it("Returns 401 if user doesnot own the ticket", async () => {
  //create ticket
  const title = "test",
    price = 10;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  //check for correctness of ticket info
  let getRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(getRes.body.title).toEqual(title);
  expect(getRes.body.price).toEqual(price);

  //update same ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin()) //this is a different user , because we are creating random user
    .send({
      title: "test_update",
      price: 105,
    })
    .expect(401);

  //check if no update was done
   getRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(getRes.body.title).toEqual(title);
  expect(getRes.body.price).toEqual(price);
});
it("Returns 400 for invalid title or price", async () => {
    const cookie = global.signin(); //ensure we are the same user

    //create ticket
     const response = await request(app)
       .post("/api/tickets")
       .set("Cookie", cookie)
       .send({
         title: "test",
         price: 10,
       })
       .expect(201);
    
    //invalid title
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "",
        price: 105,
      })
      .expect(400);
    
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        price: 105,
      })
      .expect(400);
    
    //invalid price
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "test_update",
        price: -10,
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "test_update",
      })
      .expect(400);
});
it("Update Ticket valid input", async () => {
  //create ticket
  const cookie = global.signin(); //ensure we are the same user

  //create ticket
  let title = "test", price = 10;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  //check for correctness of ticket info
  let getRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(getRes.body.title).toEqual(title);
  expect(getRes.body.price).toEqual(price);

  //update same ticket
  title = "test_update";
  price = 105;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  //check if update was done
  getRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(getRes.body.title).toEqual("test_update");
  expect(getRes.body.price).toEqual(105);
});
