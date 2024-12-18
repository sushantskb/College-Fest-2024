const mongoose = require("mongoose");

const teamRegistrationSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  team_name: {
    type: String,
  },
  name: {
    type: String,
  },
  rollno: {
    type: String,
  },
  members: [
    {
      name: {
        type: String,
        required: true,
      },
      rollno: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  ],
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  paymentApplication: {
    type: String,
  },
  transactionId: {
    type: String,
  },
});

module.exports = mongoose.model("TEAMREGISTRATION", teamRegistrationSchema);
