const mongoose = require("mongoose");

const weightLiftingEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    requried: true,
  },
  event:{
    type:String,
  },
  category: {
    type: String,
  },
});

module.exports = mongoose.model("WEIGHTLIFTSPORTS", weightLiftingEventSchema);
