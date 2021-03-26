const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  deviceid: [{ type: mongoose.Schema.Types.ObjectId, ref: "device" }],
  email: {
    require: true,
    type: String,
  },
  uid: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },

  compneyinfo: {
    description: String,
    name: String,
    email: String,
  },
});

module.exports = mongoose.model("user", UserSchema);
