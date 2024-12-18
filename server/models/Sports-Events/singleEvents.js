const mongoose = require("mongoose");

const singleEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  event: [
    {
      type: String,
      enum: [
        "chess",
        "100mtrs",
        "200mtrs",
        "400mtrs",
        "800mtrs",
        "longjump",
        "triplejump",
        "discussthrow",
        "javelinthrow",
        "shotput",
        "lemonspoon",
        "highjump"
      ],
    },
  ],
  paymentApplication: {
    type: String,
  },
  transactionId: {
    type: String,
  },
});

module.exports = mongoose.model("SINGLESPORTS", singleEventSchema);
