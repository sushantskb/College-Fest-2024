// i need single,double,team,solo,team and category
const User = require("../../../student database");
const Single = require("../../models/Sports-Events/singleEvents");
const Double = require("../../models/Sports-Events/doubleEvents");
const Team = require("../../models/Sports-Events/teamEvents");
const Solo = require("../../models/otherEvents/soloRegistration");
const Group = require("../../models/otherEvents/teamRegistration");

exports.getData = async (req, res) => {
  try {
    const user = User.find(
      (x) => x.email.toLowerCase() === req.user.email.toLowerCase()
    );
    const userData = [];
    let data = await Single.find({ email: user });
    userData.push({ data });
    data = await Double.find({ rollno: user.rollno });
    userData.push({ data });
    data = await Team.find({ rollno: user.rollno });
    userData.push({ data });
    data = await Team.find({ members: { rollno: user.rollno } });
    userData.push({ data });
    data = await Solo.find({ rollno: user.rollno });
    userData.push({ data });
    data = await Group.find({ rollno: user.rollno });
    userData.push({ data });
    data = await Group.find({ members: { rollno: user.rollno } });
    userData.push({ data });
    return userData;
  } catch (error) {
    console.log(error);
  }
};
