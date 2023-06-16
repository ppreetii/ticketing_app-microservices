import request from "supertest";
import { app } from "../../app";

it("Route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("Can only be accessed if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("Return a status other than 401 if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").set('Cookie', global.signin()).send({});
  expect(response.status).not.toEqual(401);
});

it("Returns error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10
    })
    .expect(400);
});

it("Returns error if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: -10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test"
    })
    .expect(400);
});

it("Creates ticket with valid input", async () => {});
