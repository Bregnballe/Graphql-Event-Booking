const Event = require("../../models/event");
const User = require("../../models/user");

const eventResolvers = {
    createEvent: async ({
        eventInput: {
            title,
            description,
            price
        }
    }, req) => {
        if (!req.authenticated) {
            throw new Error("Not authenticated");
        }

        const event = new Event({
            title: title,
            description: description,
            price: +price,
            creator: "5f74820a9f9b987b68c00073",
        });

        try {
            const user = await User.findById("5f74820a9f9b987b68c00073");
            if (!user) {
                throw new Error("User not found."); //Will only work with a string of the same length as a valid id
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
    events: async () => {
        try {
            const foundEvents = await Event.find().lean({
                autopopulate: true,
            });
            console.log(foundEvents)
            return foundEvents; //JSON.parse(JSON.stringify(foundEvents)); // stingifying mongoose object and then parsing it into a js object -> makes date readable (BUT SLOW!!!)
        } catch (err) {
            throw err;
        }
    },
};

module.exports = eventResolvers;

/* mutation {
  createEvent(eventInput: {title: "A Test", description: "test description", price: 9.99 }) {
    _id
  	date
  }
}

query {
  events {
    _id
    date
  }
}

*/