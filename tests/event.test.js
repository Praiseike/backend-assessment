const request = require("supertest");
const app = require("../src/app");

const token = Buffer.from("user1@gmail.com:astrongpassword",'ascii').toString('base64');


describe("Event Initialization", () => {
  it("should initialize an event with a set number of tickets", async () => {
    const res = await request(app).post("/initialize").send({
      name: "Tech Conference 2025",
      available_tickets: 4
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Created Event");
  });
});

describe("Get event status", () => {
  it("Get the status of an event", async () => {
    const res = await request(app).get("/status/1");
    expect(res.status).toBe(200);
    expect(res.body.error).toBe(false);
  });
});

describe("Get non-existent event", () => {
  it("Try to get an event that does not exist", async () => {
    const res = await request(app).get("/status/100");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe(true);
  });
});

