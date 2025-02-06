const request = require("supertest");
const app = require("../src/app");
const { sequelize } = require("../models");
const { Event, Booking, WaitingList, User } = require("../models");

const token1 = Buffer.from("user1@gmail.com:astrongpassword", 'ascii').toString('base64');
const token2 = Buffer.from("user2@gmail.com:astrongpassword", 'ascii').toString('base64');

describe("Cancel Booking Integration Tests", () => {
  let event;
  let booking;
  let user_id = 1;
  let waiting_user_id = 2;

  beforeAll(async () => {

    event = await Event.create({ name: 'House party', available_tickets: 0 });
    booking = await Booking.create({ user_id, event_id: event.id });
    await WaitingList.create({ user_id: waiting_user_id, event_id: event.id });
  });

  afterAll(async () => {
    // await sequelize.close();
  });

  it("should cancel a booking and move user from waiting list", async () => {
    const res = await request(app)
      .post("/cancel")
      .send({ event_id: event.id })
      .set("Authorization", `Basic ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Booking canceled successfully.");

    const updatedEvent = await Event.findByPk(event.id);
    expect(updatedEvent.available_tickets).toBe(0);

    const updatedBooking = await Booking.findOne({ where: { user_id: waiting_user_id, event_id: event.id } });
    expect(updatedBooking).not.toBeNull();

    const waitingListEntry = await WaitingList.findOne({ where: { user_id: waiting_user_id, event_id: event.id } });
    expect(waitingListEntry).toBeNull();
  });

  it("should return 404 if trying to cancel a non-existent booking", async () => {
    const res = await request(app)
      .post("/cancel")
      .send({ event_id: 999 })
      .set("Authorization", `Basic ${token1}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Booking not found.");
  });
});
