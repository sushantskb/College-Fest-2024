const mongoose = require("mongoose");

const doublesEventSchema = new mongoose.Schema({
  lead_name: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
  },
  member_name: {
    type: String,
    required: true,
  },
  member_roll: {
    type: String,
    required: true,
  },
  event: [
    {
      type: String,
      enum: ["badminton", "carrom", "tabletennis"],
    },
  ],
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  paymentApplication: {
    type: String,
  },
  transactionId: {
    type: String,
  },
});

module.exports = mongoose.model("DOUBLESPORTS", doublesEventSchema);
