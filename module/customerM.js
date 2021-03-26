const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
  deviceid: [{ type: mongoose.Schema.Types.ObjectId, ref: "device" }],
  email: {
    require: true,
    type: String,
  },
  uid: {
    type: String,
  },
  password: {
    require: true,
    type: String,
  },

  compneyUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("customer", CustomerSchema);
