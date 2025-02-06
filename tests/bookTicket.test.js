const request = require("supertest");

const app = require("../src/app");

const { sequelize } = require("../models");

const { Event, Booking, WaitingList } = require("../models");


const token1 = Buffer.from("user1@gmail.com:astrongpassword", 'ascii').toString('base64');
const token2 = Buffer.from("user2@gmail.com:astrongpassword", 'ascii').toString('base64');


describe("Book Ticket - Integration Tests", () => {
  let event;
  let user_id = 1;
  let waitingUserId = 2;

  beforeAll(async () => {
    // await sequelize.sync({ force: true }); // Reset test database
    event = await Event.create({ name: "Text event", available_tickets: 1 });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should successfully book a ticket when available", async () => {
    const res = await request(app)
      .post("/book")
      .send({ event_id: event.id })
      .set("Authorization", `Basic ${token1}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Ticket booked successfully");

    const updatedEvent = await Event.findByPk(event.id);
    expect(updatedEvent.available_tickets).toBe(0);

    const booking = await Booking.findOne({ where: { user_id, event_id: event.id } });
    expect(booking).not.toBeNull();
  });

  it("should add user to waiting list when tickets are sold out", async () => {
    const res = await request(app)
      .post("/book")
      .send({ event_id: event.id })
      .set("Authorization", `Basic ${token2}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No tickets available. User added to waiting list.");

    const waitingListEntry = await WaitingList.findOne({ where: { user_id: waitingUserId, event_id: event.id } });
    expect(waitingListEntry).not.toBeNull();
  });

  it("should return an error if user tries to book twice", async () => {
    const res = await request(app)
      .post("/book")
      .send({ event_id: event.id })
      .set("Authorization", `Basic ${token1}`);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("User has already booked this event.");
  });
});
