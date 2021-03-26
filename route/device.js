const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Device = require("../module/deviceM");
const User = require("../module/userM");

router.get("/register", async (req, res, next) => {
  //   res.send({ data: "data is send...." });
  try {
    const { adminID, deviceID, deviceName, macID } = req.body;
    if (!adminID || !deviceName || !macID)
      throw createError.NotAcceptable("You have to fill all the field..");
    const doExit = await Device.findOne({ macID });
    if (doExit)
      throw createError.Conflict(`This device ${macID} is already exit...`);
    const device = new Device({
      adminID,
      deviceID,
      deviceName,
      macID,
    });
    const saver = await device.save();
    if (!saver) throw createError.InternalServerError();
    res.send({ data: "Data save successfully...." });
  } catch (error) {
    next(error);
  }
});

//find all the device
router.get("/findalldevice", async (req, res, next) => {
  try {
    const allDevice = await Device.find();
    if (!allDevice) throw createError.NotFound("It doesn't have any device...");
    res.send({ data: allDevice });
  } catch (error) {
    next(error);
  }
});

//device purchase by user
router.post("/devicesaleuser", async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw createError.BadRequest();
    const findUser = await User.findOne({ deviceid: id });
    if (!findUser) throw createError.NotFound("No one purchase this device...");
    res.send({ data: findUser });
  } catch (error) {
    next(error);
  }
});

//device deleted
router.delete("/deletedevice", async (req, res, next) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) throw createError.BadRequest();
    const findSale = await User.findOne({ deviceid: deviceId });
    if (findSale)
      throw createError.Conflict(
        "This device is already sale you can't delete.."
      );
    const del = await Device.findByIdAndRemove(deviceId);
    if (!del) throw createError.NotFound("Data is not found...");
    res.send({ data: "deleted success.." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
