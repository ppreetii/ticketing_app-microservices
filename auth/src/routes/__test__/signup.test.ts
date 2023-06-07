import request from "supertest";
import { app } from "../../app";

it("Returns 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("Returns 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "password",
    })
    .expect(400);
});

it("Returns 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pa",
    })
    .expect(400);
});

it("Returns 400 with missing password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com"
    })
    .expect(400);
});

it("Returns 400 with missing email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      password: "password"
    })
    .expect(400);
});

it("Returns 400 with missing email and password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({})
    .expect(400);
});

it('Disallows SignUp with existing email', async ()=>{
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
});

it('Sets cookie after succesful Signup', async()=>{
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
})