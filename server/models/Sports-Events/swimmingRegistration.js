const mongoose = require("mongoose");

const teamEventSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  rollno: {
    type: String,
  },
  email: {
    type: String,
  },
  members: [
    {
      name: {
        type: String,
      },
      rollno: {
        type: String,
      },
    },
  ],
  event: {
    type: String,
  },
  gender:{
    type:String
  }
});

module.exports = mongoose.model("SWIMREGISTRATION", teamEventSchema);
