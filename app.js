const express = require("express");
const {
  graphqlHTTP
} = require("express-graphql");
const {
  buildSchema
} = require("graphql");
const mongoose = require("mongoose")

const app = express();

const events = [];

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
        date: String!
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
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

mongoose.connect('')


app.listen(3000);

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
*/