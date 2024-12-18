const mongoose = require("mongoose");

const teamEventSchema = new mongoose.Schema({
  team_name: {
    type: String,
    required: true,
  },
  lead_name: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
  },
  members: [
    {
      name: {
        type: String,
        required: true,
      },
      rollno:{
        type:String,
        required:true
      }
    },
  ],
  event: [
    {
      type: String,
      enum: [
        "basketball",
        "kabaddi",
        "volleyball",
        "gullycricket",
        "tennisballcricket",
        "throwball",
        "khokho",
        "futsal",
        "tugofwar",
        "4x100relay",
        "4x400relay",
        "football"
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

module.exports = mongoose.model("TEAMSPORTS", teamEventSchema);
