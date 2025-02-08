
const { Sequelize, Transaction } = require('sequelize');
const { Event, Booking, WaitingList, sequelize } = require('../../models');
const logger = require('../utils/logger');

class EventController {
  static async initializeEvent(req, res) {

    try {
      const { name, available_tickets } = req.body;
      const event = await Event.create({
        name, available_tickets
      })

      logger.info(`initialized event with id ${event.id}`)

      return res.status(201).send({
        error: false,
        message: "Created Event",
        data: event
      });

    } catch (error) {
      logger.error(error.message);
      return res.status(500).send({
        message: "Internal Server Error"
      })
    }
  }

  static async getStatus(req, res) {
    try {

      const { event_id } = req.params;

      // eager load the relations
      const eventRecord = await Event.findByPk(event_id, {
        include: [
          { model: WaitingList, as: 'waiting_list' },
          { model: Booking, as: 'bookings' }
        ],
      })

      if (!eventRecord) {
        return res.status(404).json({
          error: true,
          message: "Event with id not found"
        });
      }

      // prepare the response 
      const response = {
        name: eventRecord.name,
        available_tickets: eventRecord.available_tickets,
        waiting_list_count: eventRecord.waiting_list.length,
        bookings_count: eventRecord.bookings.length
      }
      logger.info("Fetched event status");
      return res.status(200).json({
        error: false,
        message: "Fetched event",
        data: response
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }

  }


  static async bookEvent(req, res) {
    const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED });

    try {
      const { event_id } = req.body;
      const { user_id } = req.user;

      // I first lock the row on selection for updates
      const event = await Event.findOne({
        where: { id: event_id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!event) {
        await transaction.rollback();
        return res.status(404).json({ error: true, message: "Event not found" });
      }

      const existingBooking = await Booking.findOne({
        where: { user_id, event_id },
        transaction
      });

      if (existingBooking) {
        await transaction.rollback();
        return res.status(409).json({
          error: true,
          message: "User has already booked this event.",
        });
      }


      if (event.available_tickets > 0) {
        await Booking.create({ user_id, event_id }, { transaction });

        await event.decrement("available_tickets", { by: 1, transaction });

        await transaction.commit();

        return res.status(201).json({
          error: false,
          message: "Ticket booked successfully",
        });
      }

      // If no tickets are left, add user to waiting list
      await WaitingList.findOrCreate({
        where: { user_id, event_id },
        transaction
      });

      await transaction.commit();

      return res.status(400).json({
        error: true,
        message: "No tickets available. User added to waiting list.",
      });

    } catch (error) {
      await transaction.rollback();
      console.error("Transaction failed:", error);
      return res.status(500).json({
        error: true,
        message: "An error occurred while booking the event.",
      });
    }
  }



  static async cancelBooking(req, res) {
    const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED });

    try {
      const { event_id } = req.body;
      const { user_id } = req.user;

      const booking = await Booking.findOne({
        where: { user_id, event_id },
        transaction,
      });

      if (!booking) {
        await transaction.rollback();
        return res.status(404).json({
          error: true,
          message: "Booking not found.",
        });
      }

      await booking.destroy({ transaction });

      const event = await Event.findOne({
        where: { id: event_id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!event) {
        await transaction.rollback();
        return res.status(404).json({
          error: true,
          message: "Event not found.",
        });
      }


      const nextInQueue = await WaitingList.findOne({
        where: { event_id },
        order: [["created_at", "ASC"]], // have to ensure we take the first person in the queue
        transaction,
      });

      // try check if we have a user in queue for this event
      // if we actually do, create a booking entry for that particular user

      if (nextInQueue) {
        await Booking.create({ user_id: nextInQueue.user_id, event_id }, { transaction });
        await nextInQueue.destroy({ transaction });
      } else {
        await event.increment("available_tickets", { by: 1, transaction });
      }

      await transaction.commit();

      return res.status(200).json({
        error: false,
        message: "Booking canceled successfully.",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error canceling booking:", error);
      return res.status(500).json({
        error: true,
        message: "An error occurred while canceling the booking.",
      });
    }
  }

}

module.exports = EventController;