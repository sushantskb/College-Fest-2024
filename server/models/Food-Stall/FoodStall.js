const mongoose = require("mongoose");

const foodStallSchema = new mongoose.Schema({
  stallName: {
    type: String,
  },
  eventName:{
    type:String
  },
  leaderName: {
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
  type: {
    type: String,
  },
  paymentApplication: {
    type: String,
  },
  transactionId: {
    type: String,
  },
});

module.exports = mongoose.model("FOODSTALL", foodStallSchema);
