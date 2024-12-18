const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  type:{
    type:String,
  },
  registrationLastDate: {
    type: String,
  },
  eventDate: {
    type: String,
  },
  minSize: {
    type: String,
  },
  maxSize: {
    type: String,
  },
  fees: {
    type: String,
  },
  poster: {
    type: String,
  },
  ename: {
    type: String,
  },
  category: {
    type: String,
  },
  details: {
    type: String,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
});

module.exports = mongoose.model("EVENTS", eventSchema);
