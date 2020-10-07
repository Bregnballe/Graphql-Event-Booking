const express = require("express");
const {
  graphqlHTTP
} = require("express-graphql");

const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schemas/index")

const bookingResolvers = require("./graphql/resolvers/bookings")
const eventResolvers = require("./graphql/resolvers/events")
const userResolvers = require("./graphql/resolvers/users")

const graphqlResolvers = {
  ...bookingResolvers,
  ...eventResolvers,
  ...userResolvers
};


const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

(async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.ze1o1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    app.listen(3000);
  } catch (err) {
    console.log('error: ' + err)
  }
})()