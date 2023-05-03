const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    photo: {
        type: String
    },

    birthdate: {
        type: String
    }
});

const User = mongoose.model('Image', userSchema);

module.exports = Image;