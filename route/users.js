const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../module/userM");

router.post("/register", async (req, res, next) => {
  try {
    const { deviceid, email, password, uid, compneyinfo } = req.body;
    if (!email || !password)
      throw createError.BadRequest("Email and password is important...");
    const doExit = await User.findOne({ email });
    if (doExit)
      throw createError.Conflict("Sorrey you are alredy registered ...");
    const user = new User({
      deviceid,
      email,
      uid,
      password,
      compneyinfo: {
        description: compneyinfo.description,
        name: compneyinfo.name,
        email: compneyinfo.email,
      },
    });
    const saver = await user.save();
    if (!saver) throw createError.BadRequest();
    res.send({ data: "data has saved...." });
  } catch (error) {
    next(error);
  }
});
//update devices on his schema
router.put("/deviceupdate", async (req, res, next) => {
  try {
    const { uid, deviceId } = req.body;

    if (!uid || !deviceId) throw createError.BadRequest();
    const deviceExit = await User.findOne({ deviceid: deviceId });
    if (deviceExit)
      throw createError.Conflict("This device is already sale...");
    const upd = await User.findOneAndUpdate(
      { uid },
      { $push: { deviceid: deviceId } }
    );
    if (!upd) throw createError.InternalServerError();
    res.send({ data: "Device is added..." });
  } catch (error) {
    next(error);
  }
});

//find all user
router.get("/finduser", async (req, res, next) => {
  try {
    const findAll = await User.find();
    if (!findAll) throw createError.NotFound("No one have here..");
    res.send({ data: findAll });
  } catch (error) {
    next(error);
  }
});
//find companey info in particuler user
router.post("/findusercompaney", async (req, res, next) => {
  try {
    const { uid } = req.body;
    const findAll = await User.findOne({ uid });
    if (!findAll) throw createError.NotFound("No one have here..");
    res.send({ data: findAll.compneyinfo });
  } catch (error) {
    next(error);
  }
});

//delete user by email
router.delete("/userdelete", async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) throw createError.BadRequest();
    const del = await User.findOneAndDelete({ uid });
    if (!del) throw createError.NotFound("Data is not found...");
    res.send({ data: "Data is deleted..." });
  } catch (error) {
    next(error);
  }
});

//find device user purches
router.post("/userdevice", async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) throw createError.BadRequest("The user is not found...");
    const findDevice = await User.findOne({ uid }).populate("deviceid");
    if (!findDevice) throw createError.NotFound("The user is not found...");
    res.send({ data: findDevice });
  } catch (error) {
    next(error);
  }
});

//delete device from user
router.put("/deleteDevice", async (req, res, next) => {
  try {
    const { deviceId, uid } = req.body;
    if (!deviceId || !uid) throw createError.BadRequest();
    const findDevice = await User.findOne({ uid, deviceid: deviceId });
    if (!findDevice)
      throw createError.Conflict("Sorry this item is not present..");
    const delDevice = await User.findOneAndUpdate(
      { uid },
      { $pull: { deviceid: deviceId } }
    );
    if (!delDevice)
      throw createError.NotFound("The device of this user is not found...");
    res.send({ data: "Device is deleted from here..." });
  } catch (error) {
    next(error);
  }
});
//605d7526136fdb17dcae28aa
module.exports = router;
