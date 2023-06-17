import request from "supertest";

import { app } from "../../app";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "test",
    price: 19,
  });
};

it("Returns list of tickets", async () => {
  await createTicket().expect(201);
  await createTicket().expect(201);
  await createTicket().expect(201);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
