const User = require("../../../student database");
const Event = require("../../../eventsData");
const { alreadyRegistered } = require("../../utils/checkDuplicate");
const FoodStall = require("../../models/Food-Stall/FoodStall");

exports.initPage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

exports.showPage = async (req, res) => {
  try {
    const infoRegisterObj = req.flash("infoRegister");
    const infoErrorObj = req.flash("infoErrors");
    const userData = User.find(
      (x) => x.email.toLowerCase() === req.user.email.toLowerCase()
    );
    const eventData = Event.find((x) => x.name === "Food Stall");
    console.log(eventData);
    return res.render("close", {
      csrfToken: req.csrfToken(),
      userData,
      eventData,
      infoErrorObj,
      infoRegisterObj,
      loader_title_1: "",
      loader_title_2: "",
      loader_title_3: "",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const eventData = Event.find((x) => x.name === "Food Stall");
    const tid = req.body.tid;
    const payApp = req.body.payApp;
    const size = req.body.size;
    const members = [];
    for (let i = 1; i < size; i++) {
      members.push({ rollno: req.body["rollno" + i] });
    }

    // console.log(members);

    const leader = User.find(
      (user) => req.user.email.toLowerCase() === user.email.toLowerCase()
    );

    const memberData = [];
    for (let member of members) {
      let user = User.find(
        (user) => member.rollno.toUpperCase() === user.rollno.toUpperCase()
      );
      if (!user) {
        req.flash(
          "infoErrors",
          `Incorrect Data. Please check and re-enter the data.`
        );
        return res.redirect(`/events/foodstall/test`);
      } else if (leader.rollno === user.rollno) {
        req.flash("infoErrors", `Please Give Member Roll`);
        return res.redirect(`/events/foodstall/test`);
      }
      const temp = memberData.find((x) => x.rollno === user.rollno);
      if (temp) {
        req.flash("infoErrors", `Duplicate Roll Number Found`);
        return res.redirect(`/events/foodstall/test`);
      }
      let d = { name: user.name, rollno: user.rollno };
      memberData.push(d);
    }

    const lead = await alreadyRegistered(
      leader.rollno,
      eventData.name,
      FoodStall
    );
    const member = memberData.map((user) =>
      alreadyRegistered(user.rollno, eventData.name, FoodStall)
    );

    const member_results = await Promise.all(member);

    console.log(lead);
    console.log(member_results);

    if (lead || member_results.some((x) => x)) {
      req.flash("infoErrors","Leader or any member is already registered");
      return res.redirect(`/events/foodstall`)
    } else {
      await FoodStall.create({
        stallName: req.body.tname,
        leaderName: leader.name,
        eventName:eventData.name,
        rollno: leader.rollno,
        email: leader.email,
        members: memberData,
        event: eventData.name,
        type: req.body.selectType,
        paymentApplication: payApp,
        transactionId: tid,
      });
      message = "Registered Successfully";
    }
    req.flash("infoRegister", "Registered Successfully");
    return res.redirect(`/events/foodstall`);
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", "Some error occured");
    return res.redirect(`/events/foodstall`);
  }
};
