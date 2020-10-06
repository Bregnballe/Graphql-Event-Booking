const {
  buildSchema
} = require("graphql");

/* A GraphQL Schema is a special type of object that represents the object you can fetch and what fields it has. It shows how the data is structured. This makes sure we cannot add data to or query data from fields that don't exist as well as add data of the wrong type. */

const grapqlSchema = buildSchema(`
      type Booking {
        _id: ID!
        event: Event!
        user: User!
        created: String!
      }

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
        bookings: [Booking!]!
        users: [User!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID): Booking
        cancelBooking(bookingId: ID): Booking
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
  `);

module.exports = grapqlSchema;