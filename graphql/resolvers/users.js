const bcrypt = require("bcryptjs");
const User = require("../../models/user");


const userResolvers = {
    createUser: async (args) => {
        const user = new User({
            email: args.userInput.email,
            password: bcrypt.hashSync(args.userInput.password, 12), //encrypting password
        });

        try {
            const existingUser = await User.findOne({
                email: args.userInput.email
            }).lean({
                autopopulate: true
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
    users: async () => {
        try {
            return await User.find().lean({
                autopopulate: true
            });
        } catch (err) {
            throw err;
        }
    }
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