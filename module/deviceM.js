const mongoose = require("mongoose");

const DeviceSchema = mongoose.Schema({
  adminID: {
    require: true,
    type: String,
  },
  deviceID: {
    require: true,
    type: String,
  },
  deviceName: {
    require: true,
    type: String,
  },
  macID: {
    require: true,
    type: String,
  },
  timeStamp: { type: Date, default: Date.now },
});

DeviceSchema.pre("save", function () {
  if (!this.deviceID) {
    this.deviceID = this._id;
  }
});

module.exports = mongoose.model("device", DeviceSchema);
