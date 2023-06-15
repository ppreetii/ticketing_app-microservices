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
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(401);
});

it("Returns error if invalid title is provided", async () => {});

it("Returns error if invalid price is provided", async () => {});

it("Creates ticket with valid input", async () => {});
