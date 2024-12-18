const mongoose = require("mongoose");

const swimmingEventSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  distance: {
    type: String,
  },
  minSize: {
    type: String,
  },
  maxSize: {
    type: String,
  },
  gender: {
    type: String,
  },
  ename: {
    type: String,
  },
});

module.exports = mongoose.model("SWIMEVENT", swimmingEventSchema);
