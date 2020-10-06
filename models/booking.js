const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate')

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        autopopulate: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // These are ObjectIds from the user model
        autopopulate: true // will populate the creator with user data if a query is made requesting it
    },
    created: {
        type: Date,
        default: Date.now
    },
});

bookingSchema.plugin(autopopulate);

module.exports = mongoose.model('Booking', bookingSchema);