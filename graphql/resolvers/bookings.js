const Booking = require("../../models/booking");

const bookingResolvers = {
  bookEvent: async ({ eventId }, req) => {
    if (!req.authenticated) {
      throw new Error("Not authenticated");
    }

    const booking = new Booking({
      event: eventId,
      user: "5f74820a9f9b987b68c00073",
    });

    try {
      const newBooking = await booking.save();
      return {
        ...newBooking._doc,
        created: newBooking._doc.created.toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.authenticated) {
      throw new Error("Not authenticated");
    }

    try {
      const cancelledBooking = await Booking.findByIdAndDelete(bookingId);
      if (!cancelledBooking) {
        throw new Error("Booking not found."); //Will only work with a string of the same length as a valid id
      }
      return {
        ...cancelledBooking._doc,
        created: cancelledBooking._doc.created.toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const foundBookings = await Booking.find().lean({
        autopopulate: true,
      });
      return foundBookings; //JSON.parse(JSON.stringify(foundBookings));
    } catch (err) {
      throw err;
    }
  },
};

module.exports = bookingResolvers;

/*
mutation {
    bookEvent (eventId: "5f74826a2942127a58074337" ) {
      _id
      user {
        email
      }
    }
  }
  
  mutation {
    cancelBooking(bookingId: "5f7c65be469b5d7dfc6dcdb6") {
      _id
      created
    }
  }  
*/
