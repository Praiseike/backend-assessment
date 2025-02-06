const request = require("supertest");
const app = require("../src/app");

describe("Register user", () => {
  it("attempts to register a user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "user3@gmail.com",
      password: "astrongpassword"
    });
    expect(res.status).toBe(201);
  });
});

describe("Register user error", () => {
  it("attempts to register an existing user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "user1@gmail.com",
      password: "astrongpassword"
    });
    expect(res.status).toBe(400);
  });
});


describe("Login user", () => {
  it("attempts to login a user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "user1@gmail.com",
      password: "astrongpassword"
    });
    expect(res.status).toBe(200);
  });
});

describe("Login user error", () => {
  it("attempts to login a user with wrong credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "praiseike123@gmail.com",
      password: "astrongpafsfssword"
    });
    expect(res.status).toBe(400);
  });
});