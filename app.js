const express = require("express");
const {
  graphqlHTTP
} = require("express-graphql");

const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schemas/index")
const graphqlResolvers = require("./graphql/resolvers/index")

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
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