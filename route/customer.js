const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Customer = require("../module/customerM");
const User = require("../module/userM");

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, uid, compneyUserId } = req.body;
    if (!email || !password || !compneyUserId || !uid)
      throw createError.BadRequest();
    const doExit = await Customer.findOne({ uid });
    if (doExit) throw createError.Conflict("This customer is already exit..");
    const customer = new Customer({
      email,
      password,
      compneyUserId,
      uid,
    });
    const saver = await customer.save();
    if (!saver) throw createError.InternalServerError();
    res.send({ data: "Customer data is save..." });
  } catch (error) {
    next(error);
  }
});
//from which compney customer purchese and what are the device he has
router.post("/findcustomerCompaney", async (req, res, next) => {
  try {
    const { customerUid } = req.body;
    if (!customerUid) throw createError.BadRequest();
    const custom = await Customer.findOne({ uid: customerUid }).populate(
      "compneyUserId"
    );
    if (!custom) throw createError.NotFound("This id is invalide...");
    res.send({
      customerDevice: custom.deviceid,
      compneyDetails: custom.compneyUserId,
    });
  } catch (error) {
    next(error);
  }
});
//udate devicess in customer
router.put("/deviceupdate", async (req, res, next) => {
  try {
    const { deviceId, uid } = req.body;
    if (!deviceId || !uid) throw createError.BadRequest();

    // const findcompneyUserId = await Customer.findOne({ uid });
    // if (!findcompneyUserId) throw createError.BadRequest();
    // console.log(findcompneyUserId.compneyUserId);
    // const deviceBelongCompney = await User.findOne({
    //   compneyUserId: findcompneyUserId.compneyUserId,
    //   deviceid: deviceId,
    // });
    // // console.log(deviceBelongCompney);
    // if (!deviceBelongCompney)
    //   throw createError.NotFound("Device is not found in your compney...");

    const exitDevice = await Customer.findOne({ deviceid: deviceId });
    if (exitDevice)
      throw createError.Conflict(
        "The device is already exit in any customer.."
      );
    const upd = await Customer.findOneAndUpdate(
      { uid },
      { $push: { deviceid: deviceId } }
    );
    if (!upd) throw createError.InternalServerError();
    res.send({ data: "Data save successfully..." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
