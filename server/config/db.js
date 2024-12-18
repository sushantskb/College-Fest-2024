const mongoose = require("mongoose");
const db = process.env.DBURI;

exports.conndb = () => {
  mongoose
    .connect(db)
    .then(() => console.log(`Connection Successfull`))
    .catch((e) => console.log(e));
};
