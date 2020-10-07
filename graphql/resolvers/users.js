const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const userResolvers = {
  createUser: async ({ userInput: { email, password } }) => {
    const user = new User({
      email: email,
      password: bcrypt.hashSync(password, 12), //encrypting password
    });

    try {
      const existingUser = await User.findOne({
        email: email,
      }).lean({
        autopopulate: true,
      });
      if (existingUser) {
        throw new Error("User exists already.");
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
  users: async () => {
    try {
      return await User.find().lean({
        autopopulate: true,
      });
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email }); //find User with email: email
      if (!user) {
        throw new Error("User email does not exist!");
      }
      const isEqual = await bcrypt.compare(password, user.password); //check if password matches User's password
      if (!isEqual) {
        throw new Error("Password is incorrect!");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email }, //Storing data in the token
        "somesupersecretkey", // Privat key/string used to hash the token / verify the password
        {
          expiresIn: "1h",
        }
      );
      return { userId: user.id, token: token, tokenExpiration: 1 }; //return data matching the AuthData type
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userResolvers;

/*
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
     users {
      createdEvents {
        _id
      }
    }
  }
  */
