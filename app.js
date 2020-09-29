const express = require("express");
const {
  graphqlHTTP
} = require("express-graphql");
const {
  buildSchema
} = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");

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
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
  `),
    rootValue: {
      events: async () => {
        try {
          return await Event.find().lean();
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      createEvent: async (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
        });
        try {
          const newEvent = await event.save();
          return newEvent;
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
  createEvent(eventInput: {title: "A Test", description: "test description", price: 9.99, date: "2020-09-28T17:49:53Z"}) {
    title
  	description
  }
}

query {
  events {
    _id
    date
  }
}

,
          date: new Date(args.eventInput.date),
*/