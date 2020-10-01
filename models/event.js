const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate')

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User', // These are ObjectIds from the user model
        autopopulate: true // will populate the creator with user data if a query is made requesting it
    }
});

eventSchema.plugin(autopopulate);

module.exports = mongoose.model('Event', eventSchema);