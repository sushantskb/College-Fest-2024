const mongoose = require("mongoose");

const soloRegistrationSchema = new mongoose.Schema({
  eventName: {
    type: String,
  },
  category: {
    type: String,
  },
  name: {
    type: String,
  },
  rollno: {
    type: String,
  },
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

module.exports = mongoose.model("SOLOREGISTRATION", soloRegistrationSchema);
