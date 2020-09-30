const express = require("express");
const {
  graphqlHTTP
} = require("express-graphql");
const {
  buildSchema
} = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
        users: [User!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
  `),
    rootValue: {
      events: async () => {
        try {
          return await Event.find().lean().populate('creator'); // lean() returns only plain objects, not mongoose documents. populate() adds the data from the user model to the creator field
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
          const newEvent = await event.save();
          await user.createdEvents.push(newEvent);
          await user.save();
          return newEvent;
        } catch (err) {
          throw err;
        }
      },
      users: async () => {
        try {
          return await User.find().lean().populate('createdEvents');
        } catch (err) {
          throw err;
        }
      },
      createUser: async (args) => {
        const user = new User({
          email: args.userInput.email,
          password: bcrypt.hashSync(args.userInput.password, 12),
        });
        try {
          const newUser = await user.save();
          return {
            ...newUser._doc,
            password: null
          }; //spreadout properties in object, replace password
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.ze1o1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

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