const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

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
            creator: "5f74820a9f9b987b68c00073",
        });

        try {
            const user = await User.findById("5f74820a9f9b987b68c00073");
            if (!user) {
                throw new Error('User not found.');
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
};

module.exports = graphqlResolvers;