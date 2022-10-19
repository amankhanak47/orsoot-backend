const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: {
    type: String,
  },
    phone: {
      type:Number,
    },
    otp: {
        type:Number
    },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("Users", UsersSchema);