const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const graphqlResolvers = {
    events: async () => {
        try {
            const foundEvents = await Event.find();
            return JSON.parse(JSON.stringify(foundEvents)) // stingifying mongoose object and then parsing it into a js object -> makes date readable
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            creator: "5f74820a9f9b987b68c00073"
        });

        try {
            const user = await User.findById("5f74820a9f9b987b68c00073");
            if (!user) {
                throw new Error('User not found.'); //Will only work with a string of the same length as a valid id
            }
            const newEvent = await event.save();
            await user.createdEvents.push(newEvent);
            await user.save();
            return {
                ...newEvent._doc,
                date: newEvent._doc.date.toISOString(), //spreadout properties in object, replace date with a more readable one
            };
        } catch (err) {
            throw err;
        }
    },
    users: async () => {
        try {
            return await User.find();
        } catch (err) {
            throw err;
        }
    },
    createUser: async (args) => {
        const user = new User({
            email: args.userInput.email,
            password: bcrypt.hashSync(args.userInput.password, 12), //encrypting password
        });

        try {
            const existingUser = await User.findOne({
                email: args.userInput.email
            });
            if (existingUser) {
                throw new Error('User exists already.');
            }

            const newUser = await user.save();
            return {
                ...newUser._doc,
                password: null,
            }; //spreadout properties in object, replace password
        } catch (err) {
            throw err;
        }
    },
    bookings: async () => {
        try {
            const foundBookings = await Booking.find();
            return JSON.parse(JSON.stringify(foundBookings))
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args) => {
        const booking = new Booking({
            event: args.eventId,
            user: "5f74820a9f9b987b68c00073"
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
    cancelBooking: async (args) => {
        try {
            const cancelledBooking = await Booking.findByIdAndDelete(args.bookingId);
            if (!cancelledBooking) {
                throw new Error('Booking not found.'); //Will only work with a string of the same length as a valid id
            }
            return {
                ...cancelledBooking._doc,
                created: cancelledBooking._doc.created.toISOString(),
            }
        } catch (err) {
            throw err;
        }
    }
};

module.exports = graphqlResolvers;

/* mutation {
  createEvent(eventInput: {title: "A Test", description: "test description", price: 9.99 }) {
    _id
  	date
  }
}

mutation {
  createUser(userInput: {email: "hithere@gmail.com", password: "test"}) {
    email
    password
    createdEvents {
      title
    }
  }
}

mutation {
  bookEvent (eventId: "5f74826a2942127a58074337" ) {
    _id
    user {
      email
    }
  }
}

mutation {
  cancelBooking(bookingId: "5f7c54ee5f97d606b009f593") {
    _id
  }
}


query {
  events {
    _id
    date
  }
}

query {
   users {
    createdEvents {
      _id
    }
  }
}
*/