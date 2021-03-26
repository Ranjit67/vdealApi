const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const mongoose = require("mongoose");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(
  "mongodb+srv://Vdeal:MlojNzL6oFQp8g9c@cluster0.ygg7l.mongodb.net/VodealDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.on("connected", () => {
  console.log("The data base is connected.");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  res.send("Data is send....");
});

const Device = require("./route/device");
app.use("/device", Device);
const User = require("./route/users");
app.use("/user", User);

const Customer = require("./route/customer");
app.use("/customer", Customer);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("The port 4000 is ready to start...");
});
