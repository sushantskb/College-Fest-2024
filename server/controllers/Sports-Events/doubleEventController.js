const Event = require("../../models/Sports-Events/doubleEvents");
const User = require("../../../student database");
const eventsData = require("../../../eventsData");
const {isAlreadyRegistered} = require("../../utils/checkDuplicate");

exports.showPage = async (req, res) => {
  try {
    const eventName = req.params.event;
    const infoErrorObj = req.flash("infoErrors");
    const infoRegisterObj = req.flash("infoRegister");

    const userData = User.find(
      (user) => req.user.email.toLowerCase() === user.email.toLowerCase()
    );
    const eventData = eventsData.find((event) => eventName === event.name);

    let fees;
    if (
      eventName === "badminton" && userData.gender === "male"
    ) {
      fees = "100";
    } else {
      fees = "Free";
    }

    const closed = [
      "badminton",
      "carrom"
    ]

    if(closed.includes(eventName)){
      return res.render("close", {loader_title_1: "Event", loader_title_2: "Already", loader_title_3: "Closed"});
    }

    return res.render("register_doubles", {
      csrfToken: req.csrfToken(),
      loader_title_1: "Event",
      loader_title_2: "Sports",
      loader_title_3: eventName,
      eventName,
      infoErrorObj,
      infoRegisterObj,
      userData,
      fees,
      eventData,
    });
  } catch (error) {}
};

exports.registerUsers = async (req, res) => {
  const event = req.params.event;
  let message = "";
  try {
    const roll2 = req.body.mroll;
    const payApp = req.body.payApp || "";
    const tid = req.body.tid || "";
    const user1 = User.find(
      (user) => req.user.email.toLowerCase() === user.email.toLowerCase()
    );
    const user2 = User.find(
      (user) => user.rollno.toUpperCase() === roll2.toUpperCase()
    );
    if (!user2) {
      req.flash("infoErrors", "One of the Users doen't exists");
      return res.redirect(`/events/sports/doubles/${event}`);
    } else if (user1.gender !== user2.gender) {
      req.flash("infoErrors", "Users must have the same gender");
      return res.redirect(`/events/sports/doubles/${event}`);
    } else if(user1.rollno === user2.rollno){
      req.flash("infoErrors", "Duplicate Roll Number Found");
      return res.redirect(`/events/sports/doubles/${event}`);
    }

    const lead = await isAlreadyRegistered(user1.rollno, event, Event);
    const member = await isAlreadyRegistered(user2.rollno, event, Event);

    if (lead || member) {
      message = `At least one member is already registered for ${event}`;
    } else {
      await Event.create({
        lead_name: user1.name,
        rollno: user1.rollno,
        lead_email: user1.email,
        member_name: user2.name,
        member_roll: user2.rollno,
        event: event,
        gender: user1.gender,
        paymentApplication: payApp,
        transactionId: tid,
      });
      message = "Registered Successfully";
    }
    req.flash("infoRegister", message);
    return res.redirect(`/events/sports/doubles/${event}`);
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", error);
    return res.redirect(`/events/sports/doubles/${event}`);
  }
};
